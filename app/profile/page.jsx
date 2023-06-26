'use client'

import React, { useEffect, useState } from 'react'

import Profile from '@components/Profile'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'



const MyProfile = () => {
    const [posts, setPosts] = useState({})
    const [loading, setLoading] = useState(false)
    const {data: session} = useSession()
    const router = useRouter()
    useEffect(()=>{
      
      setLoading(false)
        const fetchPosts = async () => {
          const response = await fetch(`/api/users/${session?.user.id}/posts`);
          const data = await response.json();
          setLoading(true)
          setPosts(data)
        
        }
        if(session?.user.id) fetchPosts()
      },[])
    
    const handleEdit = (post)=> {
      router.push(`/update-prompt?id=${post._id}`)
    }

    const handleDelete = async (post) => {
      const hasConfirmed = confirm("Are you sure you want to delete this prompt?")

      if(hasConfirmed){
        try {
          await fetch(`/api/prompt/${post._id.toString()}`, { method:"DELETE"})
          const filterPosts = posts.filter((p) => p._id !== post._id)
          setPosts(filterPosts)
          
        } catch (error) {
          console.log(error)
        }
      }
    }

    return (
      <>
        {loading ?
            (<Profile 
                name='my Profile'
                desc='welcome to your personalized profile page'
                data={posts}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                />) 
                : (<p>Loading ...</p>)}
      </>
      )
}

export default MyProfile
