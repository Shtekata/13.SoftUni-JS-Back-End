import Person from '../modules/Person.js'
import Cat from '../modules/Cat.js';

function createCat(name, owner) {
    let person = new Person({ name: owner, age: 35 });
    person.save()
        .then(x => {
            const cat = new Cat({ name, age: 5, breed: 'Persian', owner: x });
            return cat.save();
        })
        .then(x => console.log(x))
        .catch(err => console.log(`${err._message}: ${err.errors.name.properties.message}`));
}

export default createCat;