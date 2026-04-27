import React from 'react';
import { FaHeart, FaReply, FaLevelUpAlt, FaGift, FaClock, FaCoins } from "react-icons/fa";
import user_image from '../../assets/user_image.svg';

const navigateTo = (path, { onClose, refreshNavigation, navigate }) => {
  onClose();
  refreshNavigation();
  navigate(path);
  window.scrollTo(0, 0);
};

export const NOTIFICATION_CONFIG = {
  welcome: {
    icon: <FaGift className="text-gray-400" />,
    renderContent: ({ metadata }) => {
      const { coins_awarded } = metadata || {};
      return (
        <div className='flex-1'>
          <span className='font-bold'>👋 Welcome to Mixelo!</span>
          <div className='text-gray-600'>We're glad to have you here. Start exploring stories and grow your knowledge.</div>
          {coins_awarded && <div className='text-yellow-600 font-medium'>🪙 +{coins_awarded} MXC as a welcome gift!</div>}
        </div>
      );
    },
    onClick: (ctx) => navigateTo('/avatar', ctx),
  },
  level_up: {
    icon: <FaLevelUpAlt className="text-gray-400" />,
    renderContent: ({ metadata }) => {
      const { new_level, new_level_name, coins_awarded } = metadata || {};
      return (
        <div className='flex-1'>
          <span className='font-bold'>🎉 Congratulations!</span>
          <div className='text-gray-600'>
            You reached level {new_level} — <span className='font-semibold'>{new_level_name}</span>!
          </div>
          <div className='text-yellow-600 font-medium'>🪙 +{coins_awarded} MXC earned!</div>
        </div>
      );
    },
    onClick: (ctx) => navigateTo('/avatar', ctx),
  },
  coin_purchase_pending: {
    icon: <FaClock className="text-gray-400" />,
    renderContent: ({ metadata }) => {
      const { coins, price_cents, currency } = metadata || {};
      const price = price_cents != null ? (price_cents / 100).toFixed(2) : null;
      return (
        <div className='flex-1'>
          <span className='font-bold'>⏳ Payment being processed</span>
          <div className='text-gray-600'>Your purchase of <span className='font-semibold'>{coins} MXC</span> is pending confirmation.</div>
          {price && <div className='text-gray-400'>{price} {currency}</div>}
        </div>
      );
    },
    onClick: (ctx) => navigateTo('/suitcase/', ctx),
  },
  coin_purchase_success: {
    icon: <FaCoins className="text-gray-400" />,
    renderContent: ({ metadata }) => {
      const { coins, price_cents, currency } = metadata || {};
      const price = price_cents != null ? (price_cents / 100).toFixed(2) : null;
      return (
        <div className='flex-1'>
          <span className='font-bold'>✅ Purchase confirmed!</span>
          <div className='text-yellow-600 font-medium'>🪙 +{coins} MXC added to your balance.</div>
          {price && <div className='text-gray-400'>{price} {currency}</div>}
        </div>
      );
    },
    onClick: (ctx) => navigateTo('/suitcase/', ctx),
  },
  like: {
    icon: <FaHeart className="text-gray-400" />,
    renderContent: (notification) => <DefaultUserContent notification={notification} />,
    onClick: (ctx) => navigateToStory(ctx),
  },
  reply: {
    icon: <FaReply className="text-gray-400" />,
    renderContent: (notification) => <DefaultUserContent notification={notification} />,
    onClick: (ctx) => navigateToStory(ctx),
  },
};

export const DEFAULT_NOTIFICATION_CONFIG = {
  icon: null,
  renderContent: (notification) => <DefaultUserContent notification={notification} />,
  onClick: ({ onClose }) => onClose(),
};

function DefaultUserContent({ notification }) {
  return (
    <>
      <div className='flex items-center justify-center px-1 flex-shrink-0'>
        {notification.user_picture
          ? <img src={notification.user_picture} className='h-6 w-6 rounded-full' alt="" />
          : <img src={user_image} className='h-6 w-6' alt="" />}
      </div>
      <div className='flex-1 truncate'>
        <span className='font-bold pe-1'>{notification.user_action}</span>
        <span className='text-gray-500'>{notification.formatted_date}</span>
        <div className='text-gray-500 truncate'>{notification.comment_details?.text}</div>
      </div>
    </>
  );
}

function navigateToStory({ notification, onClose, refreshNavigation, navigate }) {
  onClose();
  refreshNavigation();
  setTimeout(() => {
    navigate(`/story/${notification.comment_details.story_slug}`, {
      state: { scrollToComments: true },
      key: Date.now(),
    });
  }, 150);
}
