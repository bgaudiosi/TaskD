var Job = {};
Job.jobName;
Job.shortDescription;
Job.longDescription;
Job.jobLister;
Job.cost;
Job.location;
Job.type;
Job.time;
Job.isActive;
Job.isComplete;
Job = function(n, sd, ld, jl, c, l, t, time, a, comp){
    this.jobName = n;
    this.shortDescription = sd; 
    this.longDescription = ld; 
    this.jobLister = jl;
    this.cost = c;
    this.location = l;
    this.type = t;
    this.time = time;
    this.isActive = a;
    this.isComplete = comp; 
}
Job.displayShortDescription = function(){
    console.log(this.shortDescription);
}
Job.displayLongDescription = function(){
    console.log(this.longDescription);
}
Job.displayJobLister = function(){
    console.log(this.jobLister);
}
Job.displayCost = function(){
    console.log(this.cost);
}
Job.displayLocation = function(){
    console.log(this.location);
}
Job.displayType = function(){
    console.log(this.type);
}
Job.displayTime = function(){
    console.log(this.time);
}
Job.getJobName = function(){
    return(this.jobName);
}
Job.getShortDescription = function(){
    return(this.shortDescription);
}
Job.getLongDescription = function(){
    return(this.longDescription);
}
Job.getJobLister = function(){
    return(this.jobLister);
}
Job.getCost = function(){
    return(this.cost);
}
Job.getLocation = function(){
    return(this.location);
}
Job.getType = function(){
    return(this.type);
}
Job.getTime = function(){
    return(this.time);
}
Job.getIsActive = function(){
    return(this.isActive);
}
Job.getIsComplete = function(){
    return(this.isComplete);
}
Job.setJobName = function(jobName){
    this.jobName=jobName;
}
Job.setShortDescription = function(shortDescription){
    this.shortDescription = shortDescription;
}
Job.setLongDescription = function(LongDescription){
   this.longDescription = LongDescription;
}
Job.setJobLister = function(jobLister){
    this.jobLister = jobLister;
}
Job.setCost = function(cost){
    this.cost = cost;
}
Job.setLocation = function(location){
    this.location = location;
}
Job.setType = function(type){
    this.type = type;
}
Job.setTime = function(time){
    this.time = time;
}
Job.setIsActive = function(isActive){
    this.isActive = isActive;
}
Job.setIsComplete = function(isComplete){
    this.isComplete = isComplete;
}
Job.toString = function(){
    ret = "";
	ret += "Job Name: " + this.jobName + "\n" + "Short Description: " + this.shortDescription + 
    "\n" + "Long Description: " + this.longDescription + "\n" + "Cost: " + this.cost + "\n" + 
    "Location: " + this.location + "\n" + "Type: " + this.type + "\n" 
	+ "Job Lister: " + this.jobLister.getuserName() + "\n";
	return ret;
}


