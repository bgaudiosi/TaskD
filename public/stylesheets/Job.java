
public class Job {
	String description;
	User jobLister;
	double cost;
	String location;
	String type;
	private boolean isActive;
	public Job(String d, User jl, double c, String l, String t, boolean a){
		description = d; jobLister = jl; cost = c; location = l; type = t; isActive = a;
	}
	public void displayDescription(){
		System.out.println(description);
	}
	public void displayJobLister(){
		System.out.println(jobLister);
	}
	public void displayCost(){
		System.out.println(cost);
	}
	public void displayLocation(){
		System.out.println(location);
	}
	public void displayType(){
		System.out.println(type);
	}
	public void displayActivity(){
		System.out.println(isActive);
	}
	
	public String toString(){
		
	}

}
