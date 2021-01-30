import Cube from '../models/Cube.js';
import uniqid from 'uniqid';

function createCube(data) {
    const cube = new Cube(uniqid(), data.name, data.description, data.imageUrl, data.difficultyLevel);
}

export default {
    create: createCube
};