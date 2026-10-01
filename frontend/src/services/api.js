import axios from 'axios'

// Local: Django on port 8000. Live site: set VITE_API_URL when building the frontend.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

// Before every request, attach the JWT token from localStorage
// Django reads this token to know who is making the request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const loginUser    = (email, password) => API.post('/auth/login/', { email, password })
export const logoutUser   = (refresh) => API.post('/auth/logout/', { refresh })
export const getMe        = () => API.get('/auth/me/')
export const changePassword = (old_password, new_password) =>
  API.post('/auth/change-password/', { old_password, new_password })

// First-time setup: the manager pre-registers the analyst's email (no password),
// and the analyst creates their own password the first time they sign in.
export const checkEmail       = (email) => API.post('/auth/check-email/', { email })
export const activateAccount  = (email, new_password) =>
  API.post('/auth/activate/', { email, new_password })

// ── REVIEW PERIODS ────────────────────────────────────────────────────────────
export const getReviewPeriods = () => API.get('/periods/')

// ── ANALYST ───────────────────────────────────────────────────────────────────
export const getMyReviews  = () => API.get('/reviews/my/')
export const submitReview  = (data) => API.post('/reviews/submit/', data)

// ── MANAGER ───────────────────────────────────────────────────────────────────
export const getTeam           = () => API.get('/manager/team/')
export const getReview         = (reviewId) => API.get(`/manager/reviews/${reviewId}/`)
export const submitFeedback    = (reviewId, data) =>
  API.post(`/manager/reviews/${reviewId}/feedback/`, data)

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export const getNotifications      = () => API.get('/notifications/')
export const markNotificationRead  = (id) => API.post(`/notifications/${id}/read/`)
export const markAllRead           = () => API.post('/notifications/read-all/')

export default API


// ═════════════════════════════════════════════════════════════════════════════
// DASHBOARD ADAPTER
// The dashboards use `api` (below). It calls the Django endpoints above and
// converts Django's field names (response_to_challenges, overall_rating,
// development_areas ...) into the shorter names the dashboards use
// (response, rating, development ...). Matches reviews/serializers.py and views.py.
// ═════════════════════════════════════════════════════════════════════════════

const TRACK_NAMES = {
  data: 'Data Analytics / Engineering',
  ib: 'IB / Corp Finance',
}

// Turns axios errors into Error objects with .status and a readable message.
// Django views return { message: '...' }; DRF itself returns { detail: '...' }.
async function call(promise) {
  try {
    const res = await promise
    return res.data
  } catch (e) {
    const data = e.response?.data
    const message =
      data?.message ||
      data?.detail ||
      (e.response
        ? `Request failed (${e.response.status})`
        : 'Could not reach the server. Check that Django is running on port 8000.')
    const err = new Error(message)
    err.status = e.response?.status ?? 0
    throw err
  }
}

const unwrap = (d) => (Array.isArray(d) ? d : Array.isArray(d?.results) ? d.results : [])

// 'mid' | 'end' | null  (Django stores period_type as 'mid' or 'end')
function periodKey(p) {
  if (!p) return null
  const s = String(p.period_type || p.type || p.name || p.title || p).toLowerCase()
  if (s.includes('mid')) return 'mid'
  if (s.includes('end')) return 'end'
  return null
}

// Active review periods, fetched once and reused. Failures are NOT cached
// and are not swallowed, so the dashboard can show the error.
let periodsCache = null
async function loadPeriods() {
  if (periodsCache) return periodsCache
  periodsCache = unwrap(await call(getReviewPeriods()))
  return periodsCache
}

// Latest active period of each type, mid first. A new year's periods win.
function currentPeriods(periods) {
  const latest = {}
  periods.forEach(p => {
    const k = periodKey(p)
    if (k && (!latest[k] || p.year > latest[k].year)) latest[k] = p
  })
  return ['mid', 'end'].map(k => latest[k]).filter(Boolean)
}

// Django feedback -> dashboard feedback
function mapFeedback(f) {
  if (!f || typeof f !== 'object' || !(f.overall_rating || f.strengths)) return null
  return {
    rating: f.overall_rating,
    strengths: f.strengths,
    development: f.development_areas,
    goals: f.goals_next_period,
    submitted_at: f.submitted_at,
  }
}

// One review row (from /reviews/my/ or from the manager team list)
function normaliseReview(r, periods) {
  const period = periods.find(p => String(p.id) === String(r.period))
  const status = r.status === 'submitted' ? 'submitted' : 'pending' // 'draft' counts as pending
  const feedback = mapFeedback(r.feedback)
  return {
    ...r,
    period: periodKey(period) || periodKey(r), // team rows carry period_type directly
    period_id: period?.id ?? r.period,
    status,
    deadline: period?.close_date || null,
    is_open: period?.is_open ?? null,
    feedback,
    // the team list sends feedback_status; /reviews/my/ sends has_feedback
    feedback_status:
      r.feedback_status || (r.has_feedback ? 'done' : status === 'submitted' ? 'pending' : 'waiting'),
  }
}

// Full Django review -> the shape the form and manager detail view read
function toDetail(d) {
  return {
    ...d,
    track: TRACK_NAMES[d.track_at_submission] || '',
    response: d.response_to_challenges,
    guidance: d.guidance_applied,
    contribution: d.real_world_contribution,
    growth: d.personal_growth,
    development: d.development_goals,
    ratings: {
      technical: d.rating_technical || 0,
      miniships: d.rating_miniships || 0,
      personal: d.rating_personal || 0,
      community: d.rating_community || 0,
      guidance: d.rating_guidance || 0,
    },
    areas: d.areas_worked_on ? d.areas_worked_on.split(',').map(a => a.trim()).filter(Boolean) : [],
    rating: d.overall_rating || 0,
    feedback: mapFeedback(d.feedback),
  }
}

// ── form <-> API shape ──────────────────────────────────────────────────────

// analyst_submit_review in views.py reads these exact keys
export function formToPayload(form, periodId, action = 'submit') {
  return {
    period_id: periodId,
    action, // 'submit' or 'draft'
    fullName: form.fullName,
    email: form.email,
    semester: form.semester,
    dateSubmitted: form.dateSubmitted,
    accomplishments: form.accomplishments,
    challenges: form.challenges,
    response: form.response,
    guidance: form.guidance,
    contribution: form.contribution,
    growth: form.growth,
    communityContribution: form.communityContribution,
    development: form.development,
    ratingTechnical: form.ratings.technical,
    ratingMiniships: form.ratings.miniships,
    ratingPersonal: form.ratings.personal,
    ratingCommunity: form.ratings.community,
    ratingGuidance: form.ratings.guidance,
    rating: form.rating,
    areas: form.areas,
  }
}

// Detail (from toDetail) -> the analyst form's state
export function reviewToForm(r) {
  return {
    fullName: r.full_name || '',
    email: r.email || '',
    semester: r.semester || '',
    track: r.track || '',
    dateSubmitted: (r.date_submitted || '').split('T')[0],
    accomplishments: r.accomplishments || '',
    challenges: r.challenges || '',
    response: r.response || '',
    guidance: r.guidance || '',
    contribution: r.contribution || '',
    growth: r.growth || '',
    communityContribution: r.community_contribution || '',
    development: r.development || '',
    ratings: r.ratings || { technical: 0, miniships: 0, personal: 0, community: 0, guidance: 0 },
    areas: r.areas || [],
    rating: r.rating || 0,
  }
}

// ── the object the dashboards use ───────────────────────────────────────────

export const api = {
  // Analyst: one entry per current period (mid, end), with this analyst's review if any
  getMyReviews: async () => {
    const [periods, mine] = await Promise.all([
      loadPeriods(),
      call(getMyReviews()).then(unwrap),
    ])
    return currentPeriods(periods).map(p => {
      const r = mine.find(x => String(x.period) === String(p.id))
      return r
        ? normaliseReview(r, periods)
        : {
            id: null,
            period: periodKey(p),
            period_id: p.id,
            status: 'pending',
            deadline: p.close_date,
            is_open: p.is_open,
            feedback: null,
          }
    })
  },

  // Analyst viewing their own past submission (picked out of /reviews/my/)
  getMyReview: async (id) => {
    const mine = unwrap(await call(getMyReviews()))
    const found = mine.find(r => String(r.id) === String(id))
    if (!found) {
      const err = new Error('Submission not found.')
      err.status = 404
      throw err
    }
    return toDetail(found)
  },

  // Analyst submits; the period's database id is looked up from its type
  submitReview: async (form, periodKeyName) => {
    const periods = await loadPeriods()
    const p = currentPeriods(periods).find(x => periodKey(x) === periodKeyName)
    if (!p) throw new Error('This review period is not currently active.')
    return call(submitReview(formToPayload(form, p.id)))
  },

  // Manager: full submission for one review
  getReview: async (id) => toDetail(await call(getReview(id))),

  // Manager: the team list
  getManagerAnalysts: async () => {
    const [periods, team] = await Promise.all([
      loadPeriods(),
      call(getTeam()).then(unwrap),
    ])
    return team.map(a => ({
      ...a,
      track_code: a.track, // 'data' | 'ib'
      track: a.track_display || TRACK_NAMES[a.track] || '',
      reviews: (a.reviews || [])
        .map(r => normaliseReview(r, periods))
        .sort((x, y) => y.id - x.id), // newest first
    }))
  },

  // Manager: new feedback and edits both use this POST (the view updates if it exists)
  saveFeedback: async (reviewId, fb) => {
    const res = await call(submitFeedback(reviewId, {
      overall_rating: fb.rating,
      strengths: fb.strengths,
      development_areas: fb.development,
      goals_next_period: fb.goals,
      action: 'submit',
    }))
    return mapFeedback(res.feedback)
  },

  // Notifications keep Django's field names (is_read)
  getNotifications: async () => unwrap(await call(getNotifications())),
  markAllNotificationsRead: () => call(markAllRead()),
}