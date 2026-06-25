from fastapi import APIRouter, Depends, Header, HTTPException, status

from schemas import LoginRequest, LoginResponse, MessageResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

MOCK_USER = UserResponse(
    id="user-001",
    username="route53-admin",
    email="admin@example.com",
)
MOCK_TOKEN = "mock-session-token"


def get_current_user(authorization: str | None = Header(default=None)) -> UserResponse:
    if authorization != f"Bearer {MOCK_TOKEN}":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing session token",
        )
    return MOCK_USER


@router.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest) -> LoginResponse:
    return LoginResponse(
        access_token=MOCK_TOKEN,
        user=MOCK_USER.model_copy(update={"username": credentials.username}),
    )


@router.post("/logout", response_model=MessageResponse)
def logout(_: UserResponse = Depends(get_current_user)) -> MessageResponse:
    return MessageResponse(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
def get_me(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
    return current_user
