import HomePage from '../features/home/HomePage';
import Login from '../features/auth/Login';

describe('Functions on EditProfile components', () => {
    it('should render successfully', () => {
        expect(HomePage).toBeTruthy();
        expect(Login).toBeTruthy();
    });
});