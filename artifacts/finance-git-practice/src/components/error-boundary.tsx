import * as React from "react"

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; resetKey?: any },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; resetKey?: any }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidUpdate(prevProps: { resetKey?: any }) {
    if (this.props.resetKey !== prevProps.resetKey) {
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <p className="text-muted-foreground">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
