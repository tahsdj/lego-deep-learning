
export const networkInit = {
    layers: [
        {
            type: 'input',
            msg: 'input (MNIST)'
        }
    ],
    createMode: false,
    edit: false,
    currentIndex: 0
}


export const networkReducer = (state, action) => {
    switch(action.type) {
        case 'CREATE_MODE':
            return {
                ...state,
                createMode: action.mode,
                edit: action.edit ? action.edit : false,
                currentIndex: action.currentIndex ? action.currentIndex : state.currentIndex
            }
        case 'ADD_LAYER':
            return {
                ...state,
                layers: [...state.layers, action.layer],
                createMode: false,
                edit: false
            }
        case 'REMOVE_LAYER':
            return {
                ...state,
                layers: state.layers.filter( (e,i) => i !== action.index)
            }
        case 'EDIT_LAYER':
            return {
                ...state,
                layers: state.layers.map( (layer, i) => {
                    if ( i === state.currentIndex ) return action.layer
                    else return layer
                }),
                createMode: false,
                edit: false
            }
        default:
            return state
    }
}
