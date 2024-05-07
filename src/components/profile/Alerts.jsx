import React, { useEffect, useState } from 'react'
import { ToggleSwitch } from 'flowbite-react'
import { updateUser } from '../../api/users.api';


export function Alerts({ profileInfo }) {
  const [switchRecall, setSwitchRecall] = useState(profileInfo.email_weekly_recalls);
  const [switchNewStories, setSwitchNewStories] = useState(profileInfo.email_new_stories);
  const [switchReplies, setSwitchReplies] = useState(profileInfo.email_reply);
  const [switchMailing, setSwitchMailing] = useState(profileInfo.email_info);
  const [switchSelectAll, setSwitchSelectAll] = useState(false);

  useEffect(() => {
    const allSwitchesAreTrue = switchRecall && switchNewStories && switchReplies && switchMailing;

    setSwitchSelectAll(allSwitchesAreTrue);
  }, [switchRecall, switchNewStories, switchReplies, switchMailing]);

  const handleSwitchChange = async (newValue, key) => {
    switch (key) {
      case 'email_weekly_recalls':
        setSwitchRecall(newValue);
        break;
      case 'email_new_stories':
        setSwitchNewStories(newValue);
        break;
      case 'email_reply':
        setSwitchReplies(newValue);
        break;
      case 'email_info':
        setSwitchMailing(newValue);
        break;
      default:
        break;
    }
    if (key === 'switchSelectAll') {
      setSwitchRecall(newValue);
      setSwitchNewStories(newValue);
      setSwitchReplies(newValue);
      setSwitchMailing(newValue);
      await updateUser(profileInfo.id, {
        email_weekly_recalls: newValue,
        email_new_stories: newValue,
        email_reply: newValue,
        email_info: newValue
      });
    } else {
      await updateUser(profileInfo.id, { [key]: newValue });
      if (!newValue) {
        setSwitchSelectAll(false);
      } else {
        const allSwitchesAreTrue = switchRecall && switchNewStories && switchReplies && switchMailing;
        setSwitchSelectAll(allSwitchesAreTrue);
      }
    }
  };

  return (
    <div className='bg-white rounded border border-gray-100 p-3 mb-3'>
      <div className='text-xl font-bold pb-1'>Alertes Email & Notifications</div>
      <div className='font-bold pb-5 text-gray-500'>
        Vous pouvez configurer “Mixelo” pour recevoir des notifications d’Email
      </div>
      <div>
        <div className='flex border-gray-100 border-b-2 items-center justify-between mb-4 pb-2'>
          <div>
            <div className='font-bold'>Alertes de rappels</div>
            <div className='text-gray-500'>
              Recevez un Email chaque semaine, pour vous rappeler de consulter les “rappels” d’événements que vous auriez sélectionné !
            </div>
          </div>
          <ToggleSwitch
            checked={switchRecall}
            onChange={(newValue) => handleSwitchChange(newValue, 'email_weekly_recalls')}
            color='cyan' />
        </div>
        <div className='flex border-gray-100 border-b-2 items-center justify-between mb-4 pb-2'>
          <div>
            <div className='font-bold'>Notifications de nouvelles histoires</div>
            <div className='text-gray-500'>
              Recevez un Email, lorsqu'une nouvelle “histoire” appartenant à un “sujet” que vous avez aimé, est créé !
            </div>
          </div>
          <ToggleSwitch
            checked={switchNewStories}
            onChange={(newValue) => handleSwitchChange(newValue, 'email_new_stories')}
            color='cyan' />
        </div>
        <div className='flex border-gray-100 border-b-2 items-center justify-between mb-4 pb-2'>
          <div>
            <div className='font-bold'>Notifications de commentaires</div>
            <div className='text-gray-500'>
              Recevez un Email, lorsqu'un autre utilisateur répond a un comentaire que vous auriez publié ou liké !
            </div>
          </div>
          <ToggleSwitch
            checked={switchReplies}
            onChange={(newValue) => handleSwitchChange(newValue, 'email_reply')}
            color='cyan' />
        </div>
        <div className='flex border-gray-100 border-b-2 items-center justify-between mb-4 pb-2'>
          <div>
            <div className='font-bold'>Notifications de Mailing</div>
            <div className='text-gray-500'>
              Recevez un Email, pour chaque nouvelle information que nous publirons concernant Mixelo ! (Mise a jours; informations diverses; evenements; promotions)
            </div>
          </div>
          <ToggleSwitch
            checked={switchMailing}
            onChange={(newValue) => handleSwitchChange(newValue, 'email_info')}
            color='cyan' />
        </div>
        <div className='flex border-gray-100 border-b-2 items-center justify-between mb-4 pb-2'>
          <div>
            <div className='font-bold'>Activez toutes les alertes de notifications</div>
            <div className='text-gray-500'>
              Recevez un Email, pour chaque événement concernant les “rappels”, les “nouvelles histoires” et les “commentaires”.
            </div>
          </div>
          <ToggleSwitch
            checked={switchSelectAll}
            onChange={(newValue) => handleSwitchChange(newValue, 'switchSelectAll')}
            color='cyan' />
        </div>
      </div>
    </div>
  )
}
