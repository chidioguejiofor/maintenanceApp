import mailManager from './server/helpers/mailManager';
import ejs from 'ejs';


const data = {
  date: '20th October 2222',
};
ejs.renderFile('./server/htmlTemplates/newRequest.ejs', data, (err, html) => {
  mailManager
    .send({
      from: 'Maintenance App <chidimaintenance@gmail.com>',
      to: 'Chidoski <chidioguejiofor@gmail.com>',
      subject: 'Hello',
      text: 'Empty',
      html,
    }, (passed) => {
      if (passed) console.log('Successful');
      else {
        console.log('Failed');
      }
    });
});

