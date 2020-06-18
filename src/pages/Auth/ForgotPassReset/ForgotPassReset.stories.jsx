import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

import Page from '.';

export default { title: 'pages/auth' };

export function ForgotPassReset() {
    return (
        <MemoryRouter initialEntries={['/im a token']}>
            <Route path='/:token'>
                <Page />
            </Route>
        </MemoryRouter>
    );
}
