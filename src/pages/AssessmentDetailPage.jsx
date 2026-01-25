import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAssessment } from '../api/assessments.api';
import { AssessmentDetail } from '../components/assessments/AssessmentDetail';


export function AssessmentDetailPage() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    loadAssessmentDetail();
  }, [id]);

  async function loadAssessmentDetail() {
    try {
      const res = await getAssessment(id);
      setAssessment(res.data);
    } catch (error) {
      setError(error);
    }
  }
  if (error) {
    return <p className="text-4xl text-red-500">Error loading assessment!</p>;
  }

  if (!assessment) {
    return <p>Loading...</p>;
  }

  return (
    <div className='pt-24 px-4 flex justify-center'>
      <AssessmentDetail assessment={assessment} />
    </div>
  );
}