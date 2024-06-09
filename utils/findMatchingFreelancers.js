const { Post } = require("../models/post");
const { User } = require("../models/User");

async function findMatchingFreelancers(job) {

  const freelancers = await User.find({
    'freelancerprofile.skills': { $in: job.Qualification }
  });
  return freelancers;
}

module.exports = {
    findMatchingFreelancers
  };

