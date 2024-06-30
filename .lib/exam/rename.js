'use strict'
const fs = require('fs').promises

/*
 * 그냥 빌드하면 github.io에서 언더스코프(_)들어간 경로를 참조 못 함.
 * 그래서
 * - 해당 경로의 폴더명을 바꿔주고
 * - 해당 경로를 참조하는 구문을 모두 고쳐주고
 * 하는 스크립트를 실행하고자 함.
 */

Promise.all([
	// fs.rename(
	// 	`${require.main.path}/../../exam/_next`,
	// 	`${require.main.path}/../../exam/next`,
	// ),
	repathCascade(`${require.main.path}/../../exam`)
]).then(()=>{
	console.log("Done.")
})

async function repathCascade(dirName){
	const entryNames = await fs.readdir(dirName)
	await Promise.all(entryNames.map(async entryName=>{
		const entryPath = `${dirName}/${entryName}`
		const stat = await fs.stat(entryPath)
		if(stat.isDirectory()){
			await repathCascade(entryPath)
		}else if(/\.(js|css|html?)$/.test(entryName)){
			let text = await fs.readFile(entryPath, 'utf-8')
			text = text.replace(/(?<=[\\/'"`])_next(?=[\\/])/g, 'next')
			await fs.writeFile(entryPath, text, 'utf-8')
		}
	}))
}