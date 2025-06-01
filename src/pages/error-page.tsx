export default function ErrorPage() {
  return (
    <div className="h-screen flex items-center justify-center flex-col text-center p-4">
      <h2 className="text-3xl font-bold text-destructive">Oops! Something went wrong.</h2>
      <p className="mt-2 text-muted-foreground">We couldn’t load the page you were looking for.</p>
    </div>
  )
}
