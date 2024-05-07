'use client'

import { zodResolver } from '@hookform/resolvers';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';


const page = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')

    return (
        <div>page</div>
    )
}

export default page