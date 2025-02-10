import { useRoutes, NonIndexRouteObject } from 'react-router-dom'
import Home from '../views/home/index'
import DemoDebug from '../views/demo/index'

export const rootRouter: NonIndexRouteObject[] = [
	{
		path: "/",
		element: <Home />
	},
	{
		path: "/demo",
		element: <DemoDebug />
	},
];

const Router = () => {
	const routes = useRoutes(rootRouter)
	return routes
};

export default Router
