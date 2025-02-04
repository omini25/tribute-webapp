import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"
import { TributeCard } from "@/components/dashboard/TributeCard"
import { Post } from "@/components/dashboard/Posts"
import axios from "axios"
import { server } from "@/server.js"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login", {
                state: { message: "You need to be logged in to access the dashboard." }
            })
        } else {
            fetchPosts(token)
        }
    }, [navigate])

    const fetchPosts = async token => {
        try {
            const response = await axios.get(`${server}/api/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setPosts(response.data.posts)
        } catch (error) {
            console.error("Error fetching posts:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-warm-800">
                            Dashboard
                        </CardTitle>
                        <CardDescription className="text-warm-600">
                            Welcome to your personal dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="tributes" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="tributes">Tributes</TabsTrigger>
                                <TabsTrigger value="posts">Recent Posts</TabsTrigger>
                            </TabsList>

                            <TabsContent value="tributes" className="space-y-6">
                                <div className="flex gap-4 overflow-x-auto pb-4">
                                    <TributeCard variant="dashed" />
                                    <TributeCard />

                                </div>
                            </TabsContent>

                            <TabsContent value="posts">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-semibold text-warm-700">
                                            Recent Posts
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {loading ? (
                                            <div className="flex justify-center items-center h-64">
                                                <Loader2 className="h-8 w-8 animate-spin text-warm-500" />
                                            </div>
                                        ) : posts.length > 0 ? (
                                            <ScrollArea className="h-[400px] pr-4">
                                                <div className="space-y-4">
                                                    {posts.map(post => (
                                                        <Post
                                                            key={post.id}
                                                            name={post.name}
                                                            time={post.time}
                                                            content={post.content}
                                                            likes={post.likes}
                                                        />
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        ) : (
                                            <p className="text-center text-warm-600">No posts yet.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
