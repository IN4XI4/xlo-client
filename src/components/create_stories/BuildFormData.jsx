export function BuildFormData(data, setSubmitMessage, setIsSubmitError, setIsLoading, topicId = null) {

  function appendIfNotNull(formData, key, value) {
    if (value !== null && value !== undefined && value !== "undefined" && value !== "null") {
      formData.append(key, value);
    }
  }

  if (!data || !data.cards) {
    console.error("Data or data.cards is undefined or null.");
    return;
  }
  let allValid = true;

  for (let cardIndex = 0; cardIndex < data.cards.length; cardIndex++) {
    const card = data.cards[cardIndex];
    for (let blockIndex = 0; blockIndex < card.blocks.length; blockIndex++) {
      if (!card.blocks[blockIndex].blockType || !card.blocks[blockIndex].content) {
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
  appendIfNotNull(formData, 'subtitle', data.subtitle);
  formData.append('is_private', data.is_private);
  formData.append('free_access', data.free_access);
  appendIfNotNull(formData, 'life_moments', data.life_moments);
  appendIfNotNull(formData, 'story_identities', data.story_identities);
  appendIfNotNull(formData, 'difficulty_level', data.difficulty_level);
  appendIfNotNull(formData, 'language', data.language);
  if (topicId) {
    formData.append('topic', topicId);
  }
  if (data.image !== null) {
    formData.append("image", data.image);
  }

  const spaces = Array.isArray(data.spaces) ? data.spaces : [];
  if (spaces.length > 0) {
    formData.append('spaces', spaces.join(','));
  }

  let globalMentorValue = data.globalMentor;
  if (data.globalMentor && typeof data.globalMentor === 'object' && 'id' in data.globalMentor) {
    globalMentorValue = data.globalMentor.id;
  }

  let globalSoftSkillValue = data.globalSoftSkill;
  if (data.globalSoftSkill && typeof data.globalSoftSkill === 'object' && 'id' in data.globalSoftSkill) {
    globalSoftSkillValue = data.globalSoftSkill.id;
  }

  data.cards.forEach((card, cardIndex) => {
    const cardPrefix = `cards[${cardIndex}]`;

    formData.append(`${cardPrefix}.cardTitle`, card.cardTitle);
    formData.append(`${cardPrefix}.selectedSoftSkill`, globalSoftSkillValue);
    formData.append(`${cardPrefix}.selectedMentor`, globalMentorValue);
    if (!topicId && card.id) {
      formData.append(`${cardPrefix}.id`, card.id);
    }

    card.blocks.forEach((block, blockIndex) => {

      const blockPrefix = `${cardPrefix}.blocks[${blockIndex}]`;
      formData.append(`${blockPrefix}.content`, block.content);
      formData.append(`${blockPrefix}.blockType`, Number(block.blockType));
      formData.append(`${blockPrefix}.order`, blockIndex);
      appendIfNotNull(formData, `${blockPrefix}.quoted_by`, block.quoted_by);
      appendIfNotNull(formData, `${blockPrefix}.block_color`, block.block_color);
      appendIfNotNull(formData, `${blockPrefix}.title`, block.title);
      appendIfNotNull(formData, `${blockPrefix}.content_class`, block.content_class);
      appendIfNotNull(formData, `${blockPrefix}.content_2`, block.content_2);
      appendIfNotNull(formData, `${blockPrefix}.options`, JSON.stringify(block.options));
      if (!topicId && block.id) {
        formData.append(`${blockPrefix}.id`, block.id);
      }

      if (block.image) {
        if (typeof block.image === 'string') {
          formData.append(`${blockPrefix}.image`, block.image);
        } else if (Array.isArray(block.image) && block.image.length > 0) {
          formData.append(`${blockPrefix}.image`, block.image[0]);
        } else if (block.image instanceof File) {
          formData.append(`${blockPrefix}.image`, block.image);
        } else {
          console.warn(`Unexpected format for block.image:`, block.image);
        }
      }
      if (block.image_2) {
        if (typeof block.image_2 === 'string') {
          formData.append(`${blockPrefix}.image_2`, block.image_2);
        } else if (Array.isArray(block.image_2) && block.image_2.length > 0) {
          formData.append(`${blockPrefix}.image_2`, block.image_2[0]);
        } else if (block.image_2 instanceof File) {
          formData.append(`${blockPrefix}.image_2`, block.image_2);
        } else {
          console.warn(`Unexpected format for block.image_2:`, block.image_2);
        }
      }
    });
  });

  return formData;
}