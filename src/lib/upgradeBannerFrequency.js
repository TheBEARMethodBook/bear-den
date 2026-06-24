function bannerStorageKey(userId) {
  return `bearden_upgrade_banner_shown_${userId}`
}

export function canShowUpgradeBanner(userId) {
  if (!userId) return false
  const lastShown = localStorage.getItem(bannerStorageKey(userId))
  return lastShown !== new Date().toDateString()
}

export function recordUpgradeBannerShown(userId) {
  if (!userId) return
  localStorage.setItem(bannerStorageKey(userId), new Date().toDateString())
}
