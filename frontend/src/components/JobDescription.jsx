import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true); // Update the local state
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob)); // helps us to real-time UI update
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          ); // Ensure the state is in sync with fetched data
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Job Card */}
      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {singleJob?.title}
            </h1>
            <div className="flex items-center gap-3 mt-4">
              <Badge variant="ghost" className="text-blue-700 font-semibold">
                {singleJob?.postion} Positions
              </Badge>
              <Badge variant="ghost" className="text-[#F83002] font-semibold">
                {singleJob?.jobType}
              </Badge>
              <Badge variant="ghost" className="text-[#7209b7] font-semibold">
                {singleJob?.salary} LPA
              </Badge>
            </div>
          </div>
          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`rounded-lg ${
              isApplied
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#7209b7] hover:bg-[#5f32ad]"
            } mt-4 py-2 px-6 ml-4`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>
        </div>

        <div className="border-b border-gray-300 pb-4">
          <h2 className="text-xl font-medium text-gray-800">Job Description</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between p-4 border border-gray-200 rounded-lg">
            <span className="font-semibold text-gray-900">Role:</span>
            <span className="font-normal text-gray-800">
              {singleJob?.title}
            </span>
          </div>
          <div className="flex justify-between p-4 border border-gray-200 rounded-lg">
            <span className="font-semibold text-gray-900">Location:</span>
            <span className="font-normal text-gray-800">
              {singleJob?.location}
            </span>
          </div>
          <div className="flex justify-between p-4 border border-gray-200 rounded-lg">
            <span className="font-semibold text-gray-900">Description:</span>
            <div className="font-normal text-gray-800 flex-1 ml-4">
              {/* Adjust the text overflow and spacing */}
              <p className="whitespace-pre-line">{singleJob?.description}</p>
            </div>
          </div>

          <div className="flex justify-between p-4 border border-gray-200 rounded-lg">
            <span className="font-semibold text-gray-900">Experience:</span>
            <span className="font-normal text-gray-800">
              {singleJob?.experienceLevel} yrs
            </span>
          </div>
          <div className="flex justify-between p-4 border border-gray-200 rounded-lg">
            <span className="font-semibold text-gray-900">Salary:</span>
            <span className="font-normal text-gray-800">
              {singleJob?.salary} LPA
            </span>
          </div>
          <div className="flex justify-between p-4 border border-gray-200 rounded-lg">
            <span className="font-semibold text-gray-900">
              Total Applicants:
            </span>
            <span className="font-normal text-gray-800">
              {singleJob?.applications?.length}
            </span>
          </div>
          <div className="flex justify-between p-4 border border-gray-200 rounded-lg">
            <span className="font-semibold text-gray-900">Posted Date:</span>
            <span className="font-normal text-gray-800">
              {singleJob?.createdAt.split("T")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 p-4 text-center text-gray-600 bg-gray-50">
        <span>© 2025 C_R_S. All rights reserved.</span>
      </div>
    </div>
  );
};

export default JobDescription;
