import UserInfo from "@user/presentation/components/user-info"

export function MainNavbar() {
  return (
    <header className="flex h-14 w-full items-center border-b border-outline-variant/60 bg-card px-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="mx-auto flex w-full max-w-[1232px] items-center justify-between">
        <UserInfo />
      </div>
    </header>
  )
}
