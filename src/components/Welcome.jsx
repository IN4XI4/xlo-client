import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/Logo-long.svg";

export function Welcome() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const view = queryParams.get('view');
  const messages = {
    default: {
      header: "Bienvenue sur Mixelo",
      description: "Imaginez un espace où chaque difficulté se transforme en une chance de grandir. Mixelo est plus qu'une simple plateforme, c'est un compagnon dans votre quête de développement personnel et professionnel. Ici, vous trouverez non seulement des outils pour surmonter les obstacles, mais aussi une source d'inspiration pour transformer vos défis actuels en tremplins pour l'avenir.",
      linkTo: "/",
      linkDesc: "Découvrez comment débloquez votre potentiel !"
    },
    forgotpassword: {
      header: "Vous avez oublié votre mot de passe?",
      description: "Ne vous inquiétez pas ! Renseigez simplement votre e-mail et nous vous enverrons un code pour réinitialiser votre mot de passe !",
      linkTo: "/",
      linkDesc: "Back to the homepage",
    },
    resetpassword: {
      header: "Réinitialisez votre mot de passe !",
      description: "Renseigez simplement votre e-mail et un nouveau mot de passe afin de vous connectez !",
      linkTo: "/",
      linkDesc: ""
    }
  };

  const currentMessages = messages[view] || messages.default;
  return (
    <div className=''>
      <div className="text-3xl md:text-5xl font-bold pb-6">
        {currentMessages.header}
      </div>
      <div className="text-[1.04rem] lg:text-xl pb-6 text-gray-500">
        {currentMessages.description}
      </div>
      <div className="text-xl inline-flex items-center cursor-pointer pb-4">
        <Link to={currentMessages.linkTo} className='flex items-center'>
          <span className="text-[#3DB1FF] pr-3">
            {currentMessages.linkDesc}
          </span>
          <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.4184 6.9451C15.4996 6.73241 15.5208 6.49836 15.4794 6.27258C15.438 6.04679 15.3359 5.83941 15.1859 5.67668L10.8999 1.02192C10.8011 0.910773 10.6829 0.822121 10.5521 0.761133C10.4214 0.700145 10.2808 0.668043 10.1385 0.6667C9.99627 0.665358 9.85517 0.694801 9.72349 0.753312C9.59181 0.811824 9.47217 0.898231 9.37157 1.00749C9.27096 1.11676 9.1914 1.24668 9.13752 1.3897C9.08365 1.53271 9.05654 1.68594 9.05777 1.84046C9.05901 1.99497 9.08857 2.14767 9.14472 2.28965C9.20088 2.43162 9.28251 2.56003 9.38485 2.66738L11.8429 5.33688H1.5715C1.28732 5.33688 1.01478 5.45948 0.813834 5.67772C0.61289 5.89595 0.5 6.19194 0.5 6.50057C0.5 6.8092 0.61289 7.10519 0.813834 7.32342C1.01478 7.54166 1.28732 7.66426 1.5715 7.66426H11.8429L9.38592 10.3326C9.28358 10.44 9.20195 10.5684 9.14579 10.7103C9.08964 10.8523 9.06008 11.005 9.05884 11.1595C9.05761 11.314 9.08472 11.4673 9.13859 11.6103C9.19247 11.7533 9.27203 11.8832 9.37264 11.9925C9.47324 12.1017 9.59288 12.1882 9.72456 12.2467C9.85624 12.3052 9.99734 12.3346 10.1396 12.3333C10.2819 12.3319 10.4225 12.2998 10.5532 12.2388C10.6839 12.1779 10.8022 12.0892 10.901 11.9781L15.187 7.3233C15.2863 7.21496 15.3649 7.08645 15.4184 6.9451Z" fill="#3DB1FF" />
          </svg>
        </Link>
      </div>
      <div>
        <img src={logo} alt="" className='h-12 md:h-24' />
      </div>
    </div>
  )
}
