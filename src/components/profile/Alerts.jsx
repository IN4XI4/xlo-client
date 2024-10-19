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
      <div className='text-xl font-bold pb-1'>Email alerts and notifications</div>
      <div className='font-bold pb-5 text-gray-500'>
        You can configure “Mixelo” to receive email notifications
      </div>
      <div>
        <div className='flex border-gray-100 border-b-2 items-center justify-between mb-4 pb-2'>
          <div>
            <div className='font-bold'>Recall alerts</div>
            <div className='text-gray-500'>
              Receive an email every week, to remind you to check the “Recall” the content you've selected!
            </div>
          </div>
          <ToggleSwitch
            checked={switchRecall}
            onChange={(newValue) => handleSwitchChange(newValue, 'email_weekly_recalls')}
            color='cyan' />
        </div>
        <div className='flex border-gray-100 border-b-2 items-center justify-between mb-4 pb-2'>
          <div>
            <div className='font-bold'>New stories notification</div>
            <div className='text-gray-500'>
              Receive an email when a new “Story” belonging to a “Topic” you've liked is created!
            </div>
          </div>
          <ToggleSwitch
            checked={switchNewStories}
            onChange={(newValue) => handleSwitchChange(newValue, 'email_new_stories')}
            color='cyan' />
        </div>
        <div className='flex border-gray-100 border-b-2 items-center justify-between mb-4 pb-2'>
          <div>
            <div className='font-bold'>Comments notification</div>
            <div className='text-gray-500'>
              Receive an email when another user replies to a comment you've posted or liked!
            </div>
          </div>
          <ToggleSwitch
            checked={switchReplies}
            onChange={(newValue) => handleSwitchChange(newValue, 'email_reply')}
            color='cyan' />
        </div>
        <div className='flex border-gray-100 border-b-2 items-center justify-between mb-4 pb-2'>
          <div>
            <div className='font-bold'>Mailing notification</div>
            <div className='text-gray-500'>
              Receive an email for each new information we publish about Mixelo! (Updates; news; events; promotions; ...)
            </div>
          </div>
          <ToggleSwitch
            checked={switchMailing}
            onChange={(newValue) => handleSwitchChange(newValue, 'email_info')}
            color='cyan' />
        </div>
        <div className='flex border-gray-100 border-b-2 items-center justify-between mb-4 pb-2'>
          <div>
            <div className='font-bold'>Activate all notification alerts</div>
            <div className='text-gray-500'>
              Receive an email for each event concerning “Recall”, “New stories” and “comments”.
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
