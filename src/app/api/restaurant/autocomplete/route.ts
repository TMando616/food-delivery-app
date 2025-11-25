import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const input = searchParams.get('input')
    const sessionToken = searchParams.get('sessionToken')

    console.log(input, sessionToken)

    if(!input) {
        NextResponse.json({ error: "文字を入力してください。" }, { status: 400 })
    }
    if(!sessionToken) {
        NextResponse.json(
            { error: "セッショントークンは必須です" }, 
            { status: 400 }
        )
    }

    try {
        
        const url ="https://places.googleapis.com/v1/places:autocomplete"
        const apiKey = process.env.GOOGLE_API_KEY
        
        const header = {
            "Content-type": "application/json",
            "X-Goog-Api-Key": apiKey!,
        }

        const requestBody = {
            input: input,
            sessionToken: sessionToken,
            includedPrimaryTypes: ["restaurant"],
            locationBias: {
                circle: {
                center: {
                    latitude: 35.6669248,
                    longitude: 139.6514163
                },
                radius: 500.0
                }
            },
            languageCode: "ja",
            includedRegionCodes: ["jp"],
        };

        const response = await fetch(url,{
            method: "post",
            body: JSON.stringify(requestBody),
            headers: header,
            next: { revalidate: 86400 }, //24時間でキャッシュを更新
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error(errorData)
            return {error: `NearbySearchリクエスト失敗${response.status}`}
        }

        const data = await response.json()

        console.log(JSON.stringify(data, null, 2))

    } catch (error) {
        console.log(error)
        return {error: "予期せぬエラーが発生しました"}
    }

    return NextResponse.json('success')
}