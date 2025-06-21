import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    is_join: 0,
};

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setIsJoin: (state, action) => {
            state.is_join = action.payload;
        }
    },
});

export const { setIsJoin } = loginSlice.actions;
export default loginSlice.reducer;
