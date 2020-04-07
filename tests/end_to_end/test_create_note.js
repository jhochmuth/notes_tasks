import {Selector} from 'testcafe';

fixture("Frontend test").page("../../html/indexApp.html");

test('Create map', async t => {
  await t
    .click('#noteFormButton')
    .typeText('#titleForm', "Title")
    .typeText('#textForm', "Text")
    .click('.popover .btn-secondary')
    .expect(Selector('.note-title').innerText).eql('Title', "Title is 'Title'")
});
