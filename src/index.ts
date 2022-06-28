type vacuum = {
  x: number,
  y: number,
  orientation:string
}
type grid = {
  x: number,
  y: number,
}
type gridCell = {
  N: boolean,
  E: boolean,
  S: boolean,
  O: boolean,
}
const directionCombinaisons: Object = { 'N': { 'G': 'O', 'D': 'E' }, 'E': { 'G': 'N', 'D': 'S' }, 'S': { 'G': 'E', 'D': 'O' }, 'O': { 'G': 'S', 'D': 'N' } } 

const message = document.querySelector<HTMLHeadingElement>('#answer');
const form = document.querySelector<HTMLFormElement>('#form');
const dimensionX = document.querySelector<HTMLInputElement>('#dimensionX');
const dimensionY = document.querySelector<HTMLInputElement>('#dimensionY');
const initialVacuumPositionX = document.querySelector<HTMLInputElement>('#initialVacuumPositionX');
const initialVacuumPositionY = document.querySelector<HTMLInputElement>('#initialVacuumPositionY');
const addInstructionG = document.querySelector<HTMLFormElement>('#addInstructionG');
const addInstructionD = document.querySelector<HTMLFormElement>('#addInstructionD');
const addInstructionA = document.querySelector<HTMLFormElement>('#addInstructionA');
const showInstructions = document.querySelector<HTMLParagraphElement>('#showInstructions');

let instructions: Array<string> = [];
let finalInstructions: Array<string> = [];
let grille: grid;
let ihoover: vacuum;


addInstructionG?.addEventListener('click', (e) => {
  instructions.push('G')
  showInstructions?.append('G')
})
addInstructionD?.addEventListener('click', (e) => {
  instructions.push('D')
  showInstructions?.append('D')
})
addInstructionA?.addEventListener('click', (e) => {
  instructions.push('A')
  showInstructions?.append('A')
})

form?.addEventListener('submit', (e) => {
  const initialVacuumOrientation = document.querySelector<HTMLInputElement>('input[name="orientation"]:checked')?.value;
  e.preventDefault();
  

  if (dimensionX?.value == null || dimensionX?.value == '' || dimensionY?.value == null || dimensionY?.value == '' || initialVacuumPositionX?.value == null || initialVacuumPositionX?.value == '' || initialVacuumPositionY?.value == null || initialVacuumPositionY?.value == '' || initialVacuumOrientation == null || initialVacuumOrientation == '' || parseInt(initialVacuumPositionX?.value) > parseInt(dimensionX?.value) || parseInt(initialVacuumPositionY?.value) > parseInt(dimensionY?.value) || instructions.length == 0) {
    if (message == null) return
    message.innerHTML = 'Erreur';
    return
  }

   grille = {x : parseInt(dimensionX.value), y : parseInt(dimensionY.value)} 
   ihoover = { x : parseInt(initialVacuumPositionX.value) , y: parseInt(initialVacuumPositionY.value) , orientation: initialVacuumOrientation};
   finalInstructions = instructions

  instructions = []
  createGrille(grille, ihoover, finalInstructions)
});

const addInstruction = (instruction: string) => {
  instructions.push(instruction)
}

const createGrille = (grille: grid, aspirateur: vacuum, finalInstructions: Array<string>) => {
  let gridObject: Object = {}
  for (let i = 0; i < grille.x; i++) {
    for (let j = 0; j < grille.y; j++)
    {
      let caseGrille: gridCell = { N: true, E: true, S: true, O:true };
      if (i == 0 && j == 0) { 
        caseGrille.S = false
        caseGrille.O = false
      }
      if (i == grille.x - 1 && j == 0) {
        caseGrille.S = false
        caseGrille.E = false
      }
      if (i == 0 && j == grille.y - 1) {
        caseGrille.N = false
        caseGrille.O = false
      }
      if (i == grille.x - 1 && j == grille.y - 1) {
        caseGrille.N = false
        caseGrille.E = false
      }
      let tempObj = {}
      tempObj[j] = caseGrille
      let oldData = gridObject[i]
      gridObject[i] = { ...oldData, ...tempObj }
      }
  }
  ihooverGo(gridObject, aspirateur, finalInstructions)
}

const ihooverGo = (currentGrid: Object, ihoover: vacuum, finalInstructions: Array<string>) => {
  for (let i = 0; i < finalInstructions.length; i++) {
    if (finalInstructions[i] == 'A') { 
      if (currentGrid[ihoover.x -1][ihoover.y -1][ihoover.orientation]) {
        ihoover = moveForward(ihoover)

      }
    }
    else {
      ihoover.orientation = directionCombinaisons[ihoover.orientation][finalInstructions[i]]
    }
  }
  showAnswer(ihoover)
}

const moveForward = (aspirateur: vacuum) => {
  if (aspirateur.orientation == 'S') {
    aspirateur.y -= 1
  }
  else if (aspirateur.orientation == 'N') {
    aspirateur.y += 1
  }
  else if(aspirateur.orientation == 'O') {
    aspirateur.x -= 1
  }
  else {
    aspirateur.x += 1
  }
  return aspirateur

}

const showAnswer = (aspirateur: vacuum) => {
  let answer = "La position finale : x=" + aspirateur.x + " y=" + aspirateur.y + " orientation=" + aspirateur.orientation;
  if (message == null) {
    console.log(aspirateur);
    return
  }
  message.innerHTML = (answer)
}
