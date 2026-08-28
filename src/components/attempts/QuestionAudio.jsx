import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './QuestionAudio.css';

export function QuestionAudio({ audio }) {
  if (!audio) return null;

  return (
    <div className="question-audio w-full sm:max-w-xs mx-auto mt-3 mb-1">
      <AudioPlayer
        src={audio}
        showJumpControls={false}
        customAdditionalControls={[]}
        layout="horizontal"
      />
    </div>
  );
}
