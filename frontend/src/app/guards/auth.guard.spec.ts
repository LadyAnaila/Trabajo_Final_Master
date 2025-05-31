import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Mock de localStorage
    const mockLocalStorage = {
      getItem: (key: string) => {
        return key === 'token' ? 'mock-token' : null;
      },
      setItem: (key: string, value: string) => {},
      removeItem: (key: string) => {}
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    // Mock del Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: mockRouter }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow activation if token exists', () => {
    expect(guard.canActivate()).toBeTrue();
  });

  it('should redirect to login if token does not exist', () => {


    Object.defineProperty(window.localStorage, 'getItem', {
      value: () => null
    });

    expect(guard.canActivate()).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});