import React from 'react';
import EditProfile from '../features/home/EditProfile';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe("Functions on EditProfile components", () => {
    localStorage.setItem("token", "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJwYWJsby5yb2JsZWRvQGFsdW1ub3MudWNuLmNsIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoic3R1ZGVudCIsImV4cCI6MTY5OTg4OTk1M30.8jrD80JAZ0zkxtLtSk59W8ESftMZVJ74FKigeXMKbLQ");
    it('allows user to enter values in name, firstLastName, and secondLastName inputs', () => {
        render(
            <BrowserRouter>
                <EditProfile />
            </BrowserRouter>
        );
    });
    localStorage.clear();
});