function wait(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function destroyPopup(popup) {
  popup.classList.remove('open');
  await wait(1000);
  popup.remove();
  popup = null;
}

function ask(options) {
    // Option Objects will have an attribute with question and for a cancel object
    return new Promise(async function(resolve) {
        // Create a popup with all the fields in it
        const popup = document.createElement('form');
        popup.classList.add('popup');
        popup.insertAdjacentHTML('afterbegin', 
            `
            <fieldset>
                <label>${options.title}</label>
                <input type="text" name="input">
			          <button type="submit">Submit</button>
            </fieldset> 
        `)  

        // Check if there is an option cancel button
        if (options.cancel) {
            const skipBtn = document.createElement('button');
            skipBtn.type = 'button';
            skipBtn.textContent = 'Cancel';
            popup.firstElementChild.appendChild(skipBtn);

            // Listen for a click cancel
            skipBtn.addEventListener('click', () => {
              resolve(null);
              destroyPopup(popup);
            },
            { once: true }
            );
        }

        // listen for submit event on the inputs
        popup.addEventListener('submit', (e) => {
            e.preventDefault();
            resolve(e.target.input.value);
            destroyPopup(popup);
          }, 
          { once: true }
        );

        // When sb does submit, resolve the data that was in the input box

        // Append popup to the document
        document.body.appendChild(popup);
        await wait(50)
        popup.classList.add('open');
    })
}

async function askQuestion(e) {
  const button = e.currentTarget;
  const shouldCancel = 'cancel' in button.dataset;
  const answer = await ask({ 
    title: button.dataset.question, 
    cancel: shouldCancel
  });
  console.log(answer);
}

const buttons = document.querySelectorAll(`[data-question]`);
buttons.forEach(button => button.addEventListener('click', askQuestion));

// -----------------------------------------

const questions = [
  { title: 'what is your name?'},
  { title: 'what is your age?', cancel: true},
  { title: 'what is your dogs name?'}
]

async function asyncMap(array, callBack) {
  const results = [];
  for (const item of array) {
    results.push(await callBack(item));
  }
  return results;
}

async function go() {
  const answers = await asyncMap(questions, ask)
  console.log(answers)
}
go();

: