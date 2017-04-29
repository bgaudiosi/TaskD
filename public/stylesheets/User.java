import java.util.ArrayList;

public class User {
	String userName;
	String userDescription;
	int numberOfActiveJobs;
	ArrayList<Job> activeJobs = new ArrayList<Job>(); //can't use array for this because of fixed size
	ArrayList<Job> previousJobs = new ArrayList<Job>(); //can't use array for this
	double overallRating;
	ArrayList<Double> individualRatings = new ArrayList<Double>();  //can't use array for this because of fixed size
	int numberOfRatings = individualRatings.size();
	
	public User(String n, String d){
		userName = n; userDescription = d;
	}
	
	public void setName(String n){
		userName = n;
	}
	public String getuserName(){
		return userName;
	}
	public void setDescription(String description){
		userDescription = description;
	}
	public String getDescription(){
		return userDescription;
	}
	public double getRating(){
		return calculateRating();
	}
	private double calculateRating(){
		double sum = 0;
		for(double rating: individualRatings){
			sum = sum + rating;
		}
		return (sum/numberOfRatings);
	}
	
	
	public void displayActiveJobs(){
			String ret = ""; 

		System.out.println("Description | Type |  Cost ($) | Location");
		for(int i = 0; i< activeJobs.size(); i++){
			ret += activeJobs.get(i).description + " | " + activeJobs.get(i).type + " | " + activeJobs.get(i).cost + " | " + activeJobs.get(i).location + "\n";
		}
		return ret;
	}
	public void displayPreviousJobs(){
		for(Job previousJob: previousJobs){
			System.out.println(previousJob);
		}
	}
	public void beginJob(Job newJob){
		activeJobs.add(newJob);
		numberOfActiveJobs++;
	}
	public void finishJob(Job finishedJob){
		activeJobs.remove(finishedJob);
		previousJobs.add(finishedJob);
		numberOfActiveJobs--;
	}
	
	public String toString(){
		
	}
	

}
