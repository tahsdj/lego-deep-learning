
export const networkInit = {
    layers: [
        {
            type: 'input',
            msg: 'input (MNIST)'
        }
    ],
    createMode: false
}


export const networkReducer = (state, action) => {
    switch(action.type) {
        case 'CREATE_MODE':
            return {
                ...state,
                createMode: action.mode
            }
        case 'ADD_LAYER':
            console.log('hi')
            return {
                ...state,
                createMode: action.mode,
                layers: [...state.layers, action.layer]
            }
        case 'REMOVE_LAYER':
            const layers = state.layers.filter( (e,i) => i !== action.index)
            return {
                ...state,
                layers: layers
            }

        default:
            return state
    }
}
