module.exports = () => ({
  text: 'Select a resource to explore',
  reply_markup: {
    inline_keyboard: [
      [{
        text: 'Bills',
        callback_data: ['congress', 'bills'].join('|')
      }]
    ]
  }
});
