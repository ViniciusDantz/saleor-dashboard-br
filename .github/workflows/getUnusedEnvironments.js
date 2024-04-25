module.exports = () => {
  let openPullRequests = JSON.parse(process.env.OPEN_PRS);
  openPullRequests = JSON.parse(openPullRequests).map(function (v) {
    return v.toLowerCase();
  });
  let environmentsForPRTesting = JSON.parse(
    process.env.ENVIRONMENTS_FOR_PR_TESTING,
  );
  environmentsForPRTesting = JSON.parse(environmentsForPRTesting);
  const prsToRemove = [];
  environmentsForPRTesting.forEach(environment => {
    if (!openPullRequests.includes(environment.name)) {
      prsToRemove.push(environment.key);
    }
  });
  return prsToRemove;
};