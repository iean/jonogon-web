export function mergeRoutePaths(paths: string[]): string {
  const routeDivider = '/';
  let finalPath = '';
  if (paths && paths.length) {
    for (let i = 0; i < paths.length; i++) {
      if (paths[i] && paths[i].trim()) {
        let path = paths[i].trim();
        if (i === 0) {
          //if first path does not ends with "/" add it
          if (!path.endsWith(routeDivider)) {
            path = path + routeDivider;
          }
        } else if (i === paths.length - 1) {
          //last item can not start with "/"
          if (path.startsWith(routeDivider)) {
            path = path.replace(routeDivider, '').trim();
          }
          //last item can not end with '/'
          // if (path.endsWith(routeDivider)) { path = path.substring(0, path.lastIndexOf(routeDivider)).trim(); }
        } else {
          //other items can not start with "/"
          if (path.startsWith(routeDivider)) {
            path = path.replace(routeDivider, '').trim();
          }
          //if path does not ends with "/" add it
          if (!path.endsWith(routeDivider)) {
            path = path + routeDivider;
          }
        }
        //merge the path
        finalPath = finalPath + path;
      }
    }
  }
  return finalPath;
}
