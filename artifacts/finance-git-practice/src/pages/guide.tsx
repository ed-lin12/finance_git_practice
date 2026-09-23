import { CheckCircle2, Circle, ArrowRight, ExternalLink } from 'lucide-react'
import { useProgress } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

const LESSONS = [
  {
    id: 'github-connection',
    title: '1. Connect to GitHub',
    description: 'First, connect this Workspace to a GitHub repository using the Replit Git pane.',
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p>Before making changes, you need to connect this environment to GitHub.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Open the Git pane in the Replit sidebar.</li>
          <li>Click the option to create a repository or connect an existing one.</li>
          <li>
            <a 
              href="https://docs.replit.com/features/workspace-tools/git-interface" 
              target="_blank" 
              rel="noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Read the official docs here <ExternalLink className="w-3 h-3" />
            </a>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'commit',
    title: '2. Make a Commit',
    description: 'Make a change to the policy document and commit it locally.',
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p>A commit takes a snapshot of your files at a specific point in time.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Open <code>practice/expense-policy.md</code> in the editor.</li>
          <li>Add a new rule about daily meal allowances.</li>
          <li>Open the Git pane, type a commit message like "Add meal allowance policy".</li>
          <li>Click <strong>Commit</strong>.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'push',
    title: '3. Push Changes',
    description: 'Upload your local commit to the remote GitHub repository.',
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p>Right now, your commit only exists in this Workspace. Let's send it to GitHub.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>In the Git pane, look for the <strong>Push</strong> button or the up-arrow icon.</li>
          <li>Click it to push your branch to the remote repository.</li>
          <li>Verify your change is visible on GitHub.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'pull',
    title: '4. Pull Changes',
    description: 'Fetch and merge changes made by others from the remote repository.',
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p>Sometimes teammates make changes on GitHub. You need to pull them down.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Go to your GitHub repository in a new browser tab.</li>
          <li>Edit <code>docs/GIT_PRACTICE.md</code> directly on GitHub and commit the change there.</li>
          <li>Come back to this Workspace, open the Git pane, and click <strong>Pull</strong>.</li>
          <li>Open <code>docs/GIT_PRACTICE.md</code> locally to see the update!</li>
        </ul>
      </div>
    )
  },
  {
    id: 'branch-pr',
    title: '5. Branching & Pull Requests',
    description: 'Create a new branch for experimental changes and open a PR.',
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p>Never work on <code>main</code> directly for big features. Use branches.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>In the Git pane, click the current branch name to create a new branch (e.g., <code>feature/travel-policy</code>).</li>
          <li>Make a change to <code>practice/expense-policy.md</code>.</li>
          <li>Commit and Push the new branch.</li>
          <li>Go to GitHub and open a Pull Request (PR) from your new branch into <code>main</code>.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'merge-conflict',
    title: '6. Resolve a Merge Conflict',
    description: 'Learn how to handle situations where two people edit the same lines.',
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p>Conflicts happen. Here is a safe way to practice fixing one.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>While on your <code>main</code> branch locally, change line 1 of a practice markdown file. Commit it, but DO NOT push.</li>
          <li>Go to GitHub, edit the <em>exact same line</em> in the same file on <code>main</code>. Commit it there.</li>
          <li>Come back to the Workspace and click <strong>Pull</strong>.</li>
          <li>Git will warn you about a conflict. Open the file, choose which change to keep (or keep both), save, and commit the resolution!</li>
        </ul>
      </div>
    )
  }
]

export default function GuidePage() {
  const { progress, toggleLesson } = useProgress()

  const completedCount = LESSONS.filter(l => progress[l.id]).length
  const progressPercent = Math.round((completedCount / LESSONS.length) * 100)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Git Practice Guide</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          A self-paced, zero-risk environment for finance professionals to learn version control.
        </p>
      </div>

      <Card className="bg-primary/5 border-primary/20 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-lg text-slate-900">Your Progress</h3>
              <p className="text-sm text-slate-600">
                Check off lessons as you complete them. This progress is saved locally to your browser.
              </p>
            </div>
            <div className="w-full md:w-64 space-y-2 shrink-0">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-primary">{progressPercent}%</span>
                <span className="text-slate-500">{completedCount} of {LESSONS.length}</span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-700 ease-in-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {LESSONS.map((lesson, index) => {
          const isCompleted = !!progress[lesson.id]
          const isNext = !isCompleted && (index === 0 || !!progress[LESSONS[index - 1].id])
          
          return (
            <Card 
              key={lesson.id} 
              className={cn(
                "transition-all duration-300 border-l-4",
                isCompleted ? "border-l-primary bg-slate-50/50" : 
                isNext ? "border-l-blue-500 shadow-md ring-1 ring-blue-500/20" : 
                "border-l-slate-200 opacity-80"
              )}
            >
              <CardContent className="p-0">
                <div className="flex items-start p-5 sm:p-6 gap-4">
                  <div className="pt-1 shrink-0">
                    <button 
                      onClick={() => toggleLesson(lesson.id, !isCompleted)}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full transition-transform hover:scale-110 active:scale-95"
                      aria-label={`Mark ${lesson.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-8 h-8 text-primary drop-shadow-sm" />
                      ) : (
                        <Circle className={cn("w-8 h-8", isNext ? "text-blue-500" : "text-slate-300 hover:text-slate-400")} />
                      )}
                    </button>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className={cn(
                        "text-xl font-bold tracking-tight mb-1",
                        isCompleted ? "text-slate-600 line-through decoration-slate-300" : "text-slate-900"
                      )}>
                        {lesson.title}
                      </h3>
                      <p className={cn(
                        "text-base",
                        isCompleted ? "text-slate-400" : "text-slate-600 font-medium"
                      )}>
                        {lesson.description}
                      </p>
                    </div>
                    
                    <div className={cn(
                      "transition-all duration-300 overflow-hidden",
                      isCompleted ? "opacity-50 h-0" : "opacity-100"
                    )}>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mt-2">
                        {lesson.content}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center pb-12 pt-4">
        {completedCount === LESSONS.length && (
          <div className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold shadow-lg animate-in zoom-in duration-500">
            🎉 Congratulations! You have completed all Git practice lessons.
          </div>
        )}
      </div>
    </div>
  )
}
