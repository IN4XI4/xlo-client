import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { getAssessment } from '../api/assessments.api';
import { AssessmentDetail } from '../components/assessments/detail/AssessmentDetail';
import { AssessmentDetailSidebarCol } from '../components/assessments/detail/AssessmentDetailSidebarCol';
import { AssessmentDetailSidebar } from '../components/assessments/detail/AssessmentDetailSidebar';
import { DEFAULT_VIEW } from '../components/assessments/detail/sidebarViews';


export function AssessmentDetailPage() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);
  const [isLg, setIsLg] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const [activeView, setActiveView] = useState(DEFAULT_VIEW);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e) => setIsLg(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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
    return <div className="text-4xl text-red-500">Error loading assessment!</div>;
  }

  if (!assessment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-10 gap-2 w-full p-4 pt-16 md:pt-24">
      <SEO
        title={`${assessment.name} Assessment`}
        description={assessment.description || `Take the "${assessment.name}" assessment on Mixelo. Topic: ${assessment.topic_name}.`}
        image={assessment.image}
      />
      {isLg
        ? <AssessmentDetailSidebarCol assessment={assessment} activeView={activeView} setActiveView={setActiveView} />
        : <AssessmentDetailSidebar assessment={assessment} activeView={activeView} setActiveView={setActiveView} />}
      <div className="lg:col-span-8 lg:px-2 lg:me-3">
        <AssessmentDetail assessment={assessment} onReload={loadAssessmentDetail} setActiveView={setActiveView} />
      </div>
    </div>
  );
}