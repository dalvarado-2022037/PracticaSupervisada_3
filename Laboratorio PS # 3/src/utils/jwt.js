'use strict'

import jwt from 'jsonwebtoken'

const secretKey = '@LlaveSecretaPracticaSupervisada3@'

export const generateJwt = async(payload)=>{
    try {
        return jwt.sign(payload,secretKey,{
            expiresIn: '6H',
            algorithm: 'HS256'
        })
    }catch(err){
        console.error(err)
        return err   
    }
}