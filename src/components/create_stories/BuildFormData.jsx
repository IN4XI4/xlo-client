export function BuildFormData(data, setSubmitMessage, setIsSubmitError, setIsLoading, topicId = null) {
  if (!data || !data.cards) {
    console.error("Data or data.cards is undefined or null.");
    return;
  }
  let allValid = true;
  
  for (let cardIndex = 0; cardIndex < data.cards.length; cardIndex++) {
    if (!data.cards[cardIndex].cardTitle || !data.cards[cardIndex].selectedSoftSkill || !data.cards[cardIndex].selectedMentor) {
      allValid = false;
    }
    for (let blockIndex = 0; blockIndex < data.cards[cardIndex].blocks.length; blockIndex++) {
      if (!data.cards[cardIndex].blocks[blockIndex].blockType || !data.cards[cardIndex].blocks[blockIndex].content) {
        allValid = false;
      }
    }
  }

  if (!allValid) {
    setSubmitMessage('Please check all cards and blocks. Some of them have incomplete information.');
    setIsSubmitError(true);
    return;
  }

  setIsLoading(true);
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('subtitle', data.subtitle);
  formData.append('is_private', data.is_private);
  formData.append('free_access', data.free_access);
  formData.append('difficulty_level', data.difficulty_level);
  formData.append('language', data.language);
  if (topicId) {
    formData.append('topic', topicId);
  }  
  if (data.image !== null) {
    formData.append("image", data.image);
  }
  
  data.cards.forEach((card, cardIndex) => {
    const cardPrefix = `cards[${cardIndex}]`;

    formData.append(`${cardPrefix}.cardTitle`, card.cardTitle);
    formData.append(`${cardPrefix}.selectedSoftSkill`, card.selectedSoftSkill);
    formData.append(`${cardPrefix}.selectedMentor`, card.selectedMentor);
    if (!topicId) {
      formData.append(`${cardPrefix}.id`, card.id);
    }

    card.blocks.forEach((block, blockIndex) => {
      const blockPrefix = `${cardPrefix}.blocks[${blockIndex}]`;

      formData.append(`${blockPrefix}.content`, block.content);
      formData.append(`${blockPrefix}.blockType`, block.blockType);
      if (!topicId && block.id) {
        formData.append(`${blockPrefix}.id`, block.id);
      }

      if (block.image && block.image.length > 0) {
        formData.append(`${blockPrefix}.image`, block.image[0]);
      }
    });
  });
  
  return formData;
}