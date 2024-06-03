export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-zA-Z0-9\\-_]+)')

  return new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
}

export function extractQueryParams(query) {
  if (!query || query.length === 0) return {}

  return query
    .substr(1)
    .split('&')
    .reduce((acc, item) => {
      const [key, value] = decodeURI(item).split('=')

      return {
        ...acc,
        [key]: value
      }
    }, {})
}