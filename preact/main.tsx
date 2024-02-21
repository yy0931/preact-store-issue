import { configureStore, createSlice } from '@reduxjs/toolkit'
import { render } from "preact"
import { useEffect, useLayoutEffect } from "preact/hooks"
import { Provider, useDispatch, useSelector } from 'react-redux'

const slice = createSlice({
    name: "counter",
    initialState: {
        a: 0,
        b: 0,
    },
    reducers: {
        incrementA: state => { state.a++ },
        incrementB: (state) => { state.b++ },
    },
})
const store = configureStore({
    reducer: {
        counter: slice.reducer,
    },
})

type State = ReturnType<typeof store.getState>

const Parent = () => {
    const dispatch = useDispatch()

    // Increment `a` every 250ms.
    useEffect(() => {
        const timer = setInterval(() => {
            dispatch(slice.actions.incrementA())
        }, 250)
        return () => clearInterval(timer)
    }, [dispatch])

    // Reference the value of `a` after useEffect.
    useSelector((state: State) => state.counter.a)

    return <Child />
}

const Child = () => {
    const dispatch = useDispatch()

    const a = useSelector((state: State) => state.counter.a)

    // Increment `b` immediately after `a` is incremented.
    useLayoutEffect(() => {
        dispatch(slice.actions.incrementB())
    }, [a, dispatch])

    // Reference the value of `a` after useLayoutEffect.
    useSelector((state: State) => state.counter.a)

    return <>{a}</>
}

render(
    <Provider store={store}>
        <Parent />
    </Provider>,
    document.body
)