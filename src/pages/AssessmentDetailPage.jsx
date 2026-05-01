import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
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
    <div className='pt-24 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32'>
      <SEO
        title={`${assessment.name} Assessment`}
        description={assessment.description || `Take the "${assessment.name}" assessment on Mixelo. Topic: ${assessment.topic_name}.`}
        image={assessment.image}
      />
      <AssessmentDetail assessment={assessment} onReload={loadAssessmentDetail} />
    </div>
  );
}