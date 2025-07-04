import Provider from './_components/Provider';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          Layout
        </div>

        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
