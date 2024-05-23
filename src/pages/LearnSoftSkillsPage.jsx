import React, { useEffect, useState } from 'react'
import { CgArrowTopLeft } from "react-icons/cg";
import { listSoftSkillsDetailed } from '../api/base.api';
import { Link, useLocation, useNavigate } from 'react-router-dom';


export function LearnSoftSkillsPage() {
  const [softskills, setSoftskills] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadSoftSkills();
  }, []);

  async function loadSoftSkills() {
    try {
      const res = await listSoftSkillsDetailed();
      console.log(res.data);
      setSoftskills(res.data);
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  }

  const handleBackClick = () => {
    if (location.state?.fromNavigation) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="pt-24 px-4 md:px-16 lg:px-32 xl:px-44">
        Loading...
      </div>
    )
  }
  return (
    <div className="pt-24 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className='text-2xl md:text-3xl font-extrabold pb-4'>
        Programme d'apprentissage des compétences générales
      </div>
      <div className='text-gray-500 pb-3'>
        Entrainer vos capacités a amélioré l’une des nombreuses compétences transversales présentes dans les histoires de Mixelo.
      </div>
      <div className='border-b-4 pb-4 md:hidden'>
        <div className='bg-gray-200 text-gray-500 text-2xl rounded-full flex h-8 w-8 items-center justify-center cursor-pointer'
          onClick={handleBackClick}>
          <CgArrowTopLeft />
        </div>
      </div>
      <div className='flex pt-3'>
        <div className='w-14 hidden md:block'>
          <div className='bg-gray-200 text-gray-500 text-2xl rounded-full flex h-8 w-8 items-center justify-center cursor-pointer'
            onClick={handleBackClick}>
            <CgArrowTopLeft />
          </div>
        </div>

        <div className='flex-auto bg-white rounded-lg p-3'>
          {softskills.map((softskill, index) => (
            <div key={index} className='p-2 bg-gray-50 rounded-lg mb-3 cursor-pointer'>
              <Link to={`/practice-softskills/${softskill.name}`}>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center'> {softskill.logo && <img src={softskill.logo} alt="" className='h-6 w-6 me-2' />}  {softskill.name} </div>
                  <div className='bg-gray-200 px-10 rounded text-gray-500 text-sm'>Level [1]</div>
                </div>
                <div className='text-end text-gray-500 text-sm'>{softskill.cards_viewed_percentage}%</div>
                <div className='bg-gray-200 rounded-lg h-2'>
                  <div className='h-2 rounded-lg'
                    style={{ background: softskill.color || '#3DB1FF', width: `${softskill.cards_viewed_percentage}%` }}></div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className='w-14 hidden md:block'></div>
      </div>
    </div>
  )
}
