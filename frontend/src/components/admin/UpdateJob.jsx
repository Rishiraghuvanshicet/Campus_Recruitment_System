import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setSingleJob } from "../../redux/jobSlice";
import { JOB_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const UpdateJob = () => {
    const { id } = useParams();  // Get job ID from the URL
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [jobData, setJobData] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experienceLevel: "",
        position: "",
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const job = useSelector((state) => state.job.singleJob);  

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const response = await axios.get(`${JOB_API_END_POINT}/get/${id}`,{
                    withCredentials: true
                });
                setJobData(response.data.job);
                dispatch(setSingleJob(response.data.job)); // Save to Redux store
            } catch (err) {
                setError("Failed to fetch job data");
            }
        };

        if (id) {
            fetchJobData();
        }
    }, [id, dispatch]);

    const handleChange = (e) => {
        setJobData({
            ...jobData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const updatedJobData = {
            ...jobData,
            requirements: Array.isArray(jobData.requirements) ? jobData.requirements.join(",") : jobData.requirements, // Ensure it's a string
        };
    
        try {
            console.log(updatedJobData); 
            const response = await axios.put(`${JOB_API_END_POINT}/update/${id}`, updatedJobData, {
                withCredentials: true
            });
            if (response.data.success) {
                toast.success(response.data.message);
                navigate(`/admin/jobs`);
            }
        } catch (err) {
            toast.error("Failed to update job");
            console.error(err); // Log detailed error for debugging
        } finally {
            setLoading(false);
        }
    };
    
    
    

    return (
        <div>
            <Navbar />
            <div className="max-w-xl mx-auto my-10">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-5 p-8">
                        <Button onClick={() => navigate("/admin/jobs")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className="font-bold text-xl">Edit Job</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={jobData.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={jobData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={jobData.requirements}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="number"
                                name="salary"
                                value={jobData.salary}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={jobData.location}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={jobData.jobType}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label>Experience Level</Label>
                            <Input
                                type="number"
                                name="experienceLevel"
                                value={jobData.experienceLevel}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label>Position</Label>
                            <Input
                                type="text"
                                name="position"
                                value={jobData.position}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    {loading ? (
                        <Button className="w-full my-4">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">
                            Update Job
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UpdateJob;
