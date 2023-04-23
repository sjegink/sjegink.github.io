/**
 * @name PromiseUtils
 * @author sjeg
 * @since 2022-12-02
 * @version 1.0
 * 
 * 다음과 같이 이용할 수 있습니다.
 * ```
 * 	require('promiseUtils')();
 * 	Promise.map([]);
 * 
 * 	const PromiseUtils = require('promiseUtils');
 * 	PromiseUtils.map([]);
 * ```
 */
if(typeof module!=='undefined'){
	module.exports = ()=>_install(Promise);
	_install(module.exports);
}
if(typeof HTMLElement!=='undefined'){
	_install(window.PromiseUtils={});
}

const _paramError = ()=>new Error(`1st parameter must be an array.`);
const AsyncFunction = (async()=>{}).constructor;

function _install(target){
	Object.entries({
		forEach,
		map,
		reduce,
		sort,
	}).map(([fnName,fn])=>{
		if(target[fnName] === undefined) target[fnName] = fn;
		else if(typeof target.reduce === 'function') console.warn(`Promise.${name} already exists.`);
		else console.warn(`Promise.${name} is already exists.`);
	});
}

/**
 * Array.forEach의 async 호환 버전
 * @name map
 * @param {Array} arr
 * @param {AsyncFunction<*,number>} fn
 * @return {Promise}
 */
function forEach(arr, fn){
	return new Promise((resolve,reject)=>{
		if(!Array.isArray(arr)) return reject(_paramError());
		let hasError = false;
		const finalPromise = arr.reduce((prevPromise,currentValue,i)=>{
			return prevPromise.then(()=>{
				if(hasError) return;
				let currentResult = fn(currentValue,i);
				if(currentResult instanceof Promise){
					return currentResult.then(true);
				}else{
					return Promise.resolve(true);
				}
			}).catch(err=>{
				hasError = true;
				reject(err);
			});
		},Promise.resolve(true));
		finalPromise.then(()=>resolve());
	});
};

/**
 * Array.map의 async 호환 버전
 * @name map
 * @param {Array} arr
 * @param {AsyncFunction<*,number>} fn
 * @return {Promise}
 */
function map(arr, fn){
	return new Promise((resolve,reject)=>{
		if(!Array.isArray(arr)) return reject(_paramError());
		let hasError = false;
		const resultArray = [];
		const finalPromise = arr.reduce((prevPromise,currentValue,i)=>{
			return prevPromise.then(()=>{
				if(hasError) return;
				let currentResult = fn(currentValue,i);
				if(currentResult instanceof Promise){
					return currentResult.then(result=>{
						resultArray[i] = result;
					});
				}else{
					resultArray[i] = currentResult;
					return Promise.resolve();
				}
			}).catch(err=>{
				hasError = true;
				reject(err);
			});
		},Promise.resolve());
		finalPromise.then(()=>resolve(resultArray));
	});
};

/**
 * Array.reduce의 async 호환 버전
 * @name reduce
 * @param {Array} arr
 * @param {AsyncFunction<*,*,number,Array>} fn
 * @param {*} initialValue
 * @return {Promise}
 */
function reduce(arr, fn, initialValue){
	return new Promise((resolve,reject)=>{
		if(!Array.isArray(arr)) return reject(_paramError());
		let hasError = false;
		const finalPromise = arr.reduce((prevPromise,currentValue,i)=>{
			return prevPromise.then(prevResult=>{
				if(hasError) return;
				let currentResult = fn(prevResult,currentValue,i,arr);
				if(currentResult instanceof Promise){
					return currentResult;
				}else{
					return Promise.resolve(currentResult);
				}
			}).catch(err=>{
				hasError = true;
				reject(err);
			});;
		},Promise.resolve(initialValue));
		finalPromise.then(resolve);
	});
};

/**
 * Array.sort의 async 호환 버전
 * @name sort
 * @param {Array} arr
 * @param {AsyncFunction<*,number>} fnAsync 비동기작업을 통한 비교용 값 구하는 함수
 * @param {function<*,*>} fnCompare 비교용 값을 활용한 비교식
 * @return {Promise<Array>}
 */
function sort(arr, fnAsync, fnCompare){
	return new Promise((resolve,reject)=>{
		if(!Array.isArray(arr)) return reject(_paramError());
		const finalPromise = Promise.all(arr.map(async (value,i)=>{
			return [value, await fnAsync(value,i)];
		}));
		finalPromise.catch(reject);
		finalPromise.then(arrPair=>{
			try{
				arrPair.sort((pairA,pairB)=>fnCompare(pairA[1],pairB[1]));
			}catch(e){
				reject(e);
			}
			resolve(arrPair.map(pair=>pair[0]));
		});
	});
};