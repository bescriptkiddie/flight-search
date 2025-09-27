/**
 * 综合搜索功能测试
 * 模拟真实用户操作，全面测试搜索功能
 */

console.clear();
console.log('%c=== 开始综合搜索功能测试 ===', 'font-size: 18px; color: blue; font-weight: bold;');

// 测试结果
const testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
};

// 测试辅助函数
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}] [TEST]`;

    switch(type) {
        case 'success':
            console.log(`%c${prefix} ✅ ${message}`, 'color: green');
            break;
        case 'error':
            console.error(`%c${prefix} ❌ ${message}`, 'color: red');
            break;
        case 'warning':
            console.warn(`%c${prefix} ⚠️ ${message}`, 'color: orange');
            break;
        default:
            console.log(`${prefix} ℹ️ ${message}`);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 获取当前状态
function getCurrentState() {
    return {
        departureSearch: document.getElementById('departureSearch')?.value || '',
        destinationSearch: document.getElementById('destinationSearch')?.value || '',
        activeTripType: document.querySelector('.trip-type-btn.active')?.textContent || '未知',
        flightCount: document.querySelectorAll('#flightTableBody tr').length,
        totalFlights: document.getElementById('totalFlights')?.textContent || '0',
        filterStatus: document.getElementById('filterStatus')?.textContent || '未知'
    };
}

// 测试1: 基础页面加载
async function testBasicLoading() {
    log('测试1: 基础页面加载');
    testResults.total++;

    try {
        // 检查关键元素是否存在
        const requiredElements = [
            'departureSearch',
            'destinationSearch',
            'flightTable',
            'flightTableBody',
            'totalFlights',
            'filterStatus'
        ];

        let allFound = true;
        for (const id of requiredElements) {
            const element = document.getElementById(id);
            if (!element) {
                log(`未找到元素: ${id}`, 'error');
                allFound = false;
            }
        }

        // 检查是否有航班数据
        const flightRows = document.querySelectorAll('#flightTableBody tr');
        const hasData = flightRows.length > 0;

        if (allFound && hasData) {
            log(`✅ 基础加载测试通过 - 找到 ${flightRows.length} 条航班数据`);
            testResults.passed++;
            return true;
        } else {
            log('❌ 基础加载测试失败');
            testResults.failed++;
            return false;
        }
    } catch (error) {
        log(`基础加载测试错误: ${error.message}`, 'error');
        testResults.failed++;
        return false;
    }
}

// 测试2: 城市搜索功能
async function testCitySearch() {
    log('\n测试2: 城市搜索功能');
    testResults.total++;

    try {
        const departureInput = document.getElementById('departureSearch');
        const destinationInput = document.getElementById('destinationSearch');

        if (!departureInput || !destinationInput) {
            throw new Error('城市搜索输入框未找到');
        }

        // 清空输入
        departureInput.value = '';
        destinationInput.value = '';
        await sleep(300);

        // 测试1: 输入出发城市
        departureInput.value = '北京';
        departureInput.dispatchEvent(new Event('input'));
        await sleep(500);

        const state1 = getCurrentState();
        log(`输入"北京"后 - 航班数: ${state1.flightCount}`);

        // 测试2: 输入目的地城市
        destinationInput.value = '上海';
        destinationInput.dispatchEvent(new Event('input'));
        await sleep(500);

        const state2 = getCurrentState();
        log(`输入"上海"后 - 航班数: ${state2.flightCount}`);

        // 验证结果
        const hasBeijingShanghai = state2.flightCount > 0;

        if (hasBeijingShanghai) {
            log('✅ 城市搜索功能测试通过');
            testResults.passed++;

            // 清空搜索
            departureInput.value = '';
            destinationInput.value = '';
            departureInput.dispatchEvent(new Event('input'));
            await sleep(300);

            return true;
        } else {
            log('❌ 城市搜索功能测试失败 - 未找到匹配的航班');
            testResults.failed++;
            return false;
        }
    } catch (error) {
        log(`城市搜索测试错误: ${error.message}`, 'error');
        testResults.failed++;
        return false;
    }
}

// 测试3: 行程类型切换
async function testTripTypeSwitching() {
    log('\n测试3: 行程类型切换');
    testResults.total++;

    try {
        const roundTripBtn = document.querySelector('[data-type="round-trip"]');
        const oneWayBtn = document.querySelector('[data-type="one-way"]');

        if (!roundTripBtn || !oneWayBtn) {
            throw new Error('行程类型按钮未找到');
        }

        // 设置城市搜索条件
        const departureInput = document.getElementById('departureSearch');
        const destinationInput = document.getElementById('destinationSearch');

        departureInput.value = '北京';
        destinationInput.value = '上海';
        departureInput.dispatchEvent(new Event('input'));
        await sleep(500);

        // 记录单程状态
        const oneWayState = getCurrentState();
        log(`单程模式 - 航班数: ${oneWayState.flightCount}`);

        // 切换到往返
        roundTripBtn.click();
        await sleep(500);

        const roundTripState = getCurrentState();
        log(`往返模式 - 航班数: ${roundTripState.flightCount}`);

        // 检查是否有去程/返程标记
        const hasDirectionMarks = Array.from(document.querySelectorAll('#flightTableBody tr'))
            .some(row => row.textContent.includes('去程') || row.textContent.includes('返程'));

        // 切换回单程
        oneWayBtn.click();
        await sleep(500);

        const backToOneWayState = getCurrentState();
        log(`切换回单程 - 航班数: ${backToOneWayState.flightCount}`);

        // 验证城市条件是否保留
        const hasCityCondition = departureInput.value === '北京' && destinationInput.value === '上海';

        // 检查数据一致性
        const dataConsistent = oneWayState.flightCount === backToOneWayState.flightCount;

        if (hasDirectionMarks && hasCityCondition && dataConsistent) {
            log('✅ 行程类型切换测试通过');
            testResults.passed++;

            // 清空搜索
            departureInput.value = '';
            destinationInput.value = '';
            departureInput.dispatchEvent(new Event('input'));
            await sleep(300);

            return true;
        } else {
            log('❌ 行程类型切换测试失败');
            log(`  - 有方向标记: ${hasDirectionMarks}`);
            log(`  - 保留城市条件: ${hasCityCondition}`);
            log(`  - 数据一致: ${dataConsistent}`);
            testResults.failed++;
            return false;
        }
    } catch (error) {
        log(`行程类型切换测试错误: ${error.message}`, 'error');
        testResults.failed++;
        return false;
    }
}

// 测试4: 时间段筛选
async function testTimeFiltering() {
    log('\n测试4: 时间段筛选');
    testResults.total++;

    try {
        // 重置所有筛选
        const resetBtn = document.querySelector('button[onclick="resetFilters()"]');
        if (resetBtn) {
            resetBtn.click();
            await sleep(500);
        }

        // 选择晚上时间段
        const nightBtn = document.querySelector('[data-time="night"]');
        if (!nightBtn) {
            throw new Error('晚上时间段按钮未找到');
        }

        // 记录初始状态
        const initialState = getCurrentState();
        log(`初始状态 - 航班数: ${initialState.flightCount}`);

        // 点击晚上筛选
        nightBtn.click();
        await sleep(500);

        const nightState = getCurrentState();
        log(`晚上筛选后 - 航班数: ${nightState.flightCount}`);

        // 验证只显示晚上航班
        const flightRows = document.querySelectorAll('#flightTableBody tr');
        let allNightFlights = true;
        let nightFlightCount = 0;

        flightRows.forEach(row => {
            const timeText = row.textContent;
            // 检查是否包含晚上时间（18:00-23:59）
            const hasNightTime = timeText.match(/(18|19|20|21|22|23):\d{2}/);
            if (hasNightTime) {
                nightFlightCount++;
            } else {
                // 检查是否是00:00-06:00的凌晨航班（也符合晚上筛选）
                const hasEarlyTime = timeText.match(/(00|01|02|03|04|05):\d{2}/);
                if (!hasEarlyTime) {
                    allNightFlights = false;
                }
            }
        });

        log(`找到 ${nightFlightCount} 个晚上航班`);

        // 切换回全部时段
        const allBtn = document.querySelector('[data-time="all"]');
        if (allBtn) {
            allBtn.click();
            await sleep(500);
        }

        const allState = getCurrentState();
        log(`切换回全部 - 航班数: ${allState.flightCount}`);

        const restoredCorrectly = allState.flightCount === initialState.flightCount;

        if (allNightFlights && nightState.flightCount > 0 && restoredCorrectly) {
            log('✅ 时间段筛选测试通过');
            testResults.passed++;
            return true;
        } else {
            log('❌ 时间段筛选测试失败');
            log(`  - 全是晚上航班: ${allNightFlights}`);
            log(`  - 有筛选结果: ${nightState.flightCount > 0}`);
            log(`  - 正确恢复: ${restoredCorrectly}`);
            testResults.failed++;
            return false;
        }
    } catch (error) {
        log(`时间段筛选测试错误: ${error.message}`, 'error');
        testResults.failed++;
        return false;
    }
}

// 测试5: 多条件组合筛选
async function testMultipleFilters() {
    log('\n测试5: 多条件组合筛选');
    testResults.total++;

    try {
        // 重置所有筛选
        const resetBtn = document.querySelector('button[onclick="resetFilters()"]');
        if (resetBtn) {
            resetBtn.click();
            await sleep(500);
        }

        // 设置城市搜索
        const departureInput = document.getElementById('departureSearch');
        const destinationInput = document.getElementById('destinationSearch');

        departureInput.value = '北京';
        destinationInput.value = '上海';
        departureInput.dispatchEvent(new Event('input'));
        await sleep(500);

        // 应用时间段筛选（晚上）
        const nightBtn = document.querySelector('[data-time="night"]');
        if (nightBtn) {
            nightBtn.click();
            await sleep(500);
        }

        // 应用2666筛选（如果可用）
        const filter2666 = document.querySelector('[data-availability="2666"]');
        if (filter2666) {
            filter2666.click();
            await sleep(500);
        }

        const finalState = getCurrentState();
        log(`多条件组合后 - 航班数: ${finalState.flightCount}`);

        // 验证所有条件都被应用
        const hasCityCondition = departureInput.value === '北京' && destinationInput.value === '上海';
        const hasResults = finalState.flightCount > 0;

        if (hasCityCondition && hasResults) {
            log('✅ 多条件组合筛选测试通过');
            testResults.passed++;

            // 重置
            resetBtn.click();
            await sleep(500);

            return true;
        } else {
            log('❌ 多条件组合筛选测试失败');
            log(`  - 保留城市条件: ${hasCityCondition}`);
            log(`  - 有筛选结果: ${hasResults}`);
            testResults.failed++;
            return false;
        }
    } catch (error) {
        log(`多条件组合测试错误: ${error.message}`, 'error');
        testResults.failed++;
        return false;
    }
}

// 测试6: 边界情况
async function testEdgeCases() {
    log('\n测试6: 边界情况测试');
    testResults.total++;

    try {
        let testsPassed = 0;
        let totalSubTests = 0;

        // 子测试1: 空搜索
        totalSubTests++;
        const departureInput = document.getElementById('departureSearch');
        const destinationInput = document.getElementById('destinationSearch');

        departureInput.value = '';
        destinationInput.value = '';
        departureInput.dispatchEvent(new Event('input'));
        await sleep(500);

        const emptyState = getCurrentState();
        if (emptyState.flightCount > 0) {
            log('✅ 空搜索测试通过');
            testsPassed++;
        } else {
            log('❌ 空搜索测试失败');
        }

        // 子测试2: 搜索不存在的城市
        totalSubTests++;
        departureInput.value = '不存在的城市XYZ';
        destinationInput.value = '另一个不存在的城市ABC';
        departureInput.dispatchEvent(new Event('input'));
        await sleep(500);

        const noResultState = getCurrentState();
        const noResultsText = document.querySelector('#flightTableBody')?.textContent || '';
        const hasNoResultsMessage = noResultsText.includes('没有找到') || noResultsText.includes('未找到');

        if (noResultState.flightCount === 0 && hasNoResultsMessage) {
            log('✅ 无结果搜索测试通过');
            testsPassed++;
        } else {
            log('❌ 无结果搜索测试失败');
        }

        // 子测试3: 特殊字符
        totalSubTests++;
        departureInput.value = '!@#$%^&*()';
        departureInput.dispatchEvent(new Event('input'));
        await sleep(500);

        const specialCharState = getCurrentState();
        if (specialCharState.flightCount === 0) {
            log('✅ 特殊字符测试通过');
            testsPassed++;
        } else {
            log('❌ 特殊字符测试失败');
        }

        // 子测试4: 快速连续操作
        totalSubTests++;
        departureInput.value = '北京';
        for (let i = 0; i < 5; i++) {
            departureInput.dispatchEvent(new Event('input'));
            await sleep(50);
        }
        await sleep(500);

        const rapidState = getCurrentState();
        if (rapidState.flightCount > 0) {
            log('✅ 快速连续操作测试通过');
            testsPassed++;
        } else {
            log('❌ 快速连续操作测试失败');
        }

        // 重置
        departureInput.value = '';
        destinationInput.value = '';
        departureInput.dispatchEvent(new Event('input'));
        await sleep(300);

        if (testsPassed === totalSubTests) {
            log('✅ 边界情况测试全部通过');
            testResults.passed++;
            return true;
        } else {
            log(`❌ 边界情况测试失败 - ${testsPassed}/${totalSubTests} 通过`);
            testResults.failed++;
            return false;
        }
    } catch (error) {
        log(`边界情况测试错误: ${error.message}`, 'error');
        testResults.failed++;
        return false;
    }
}

// 测试7: 数据一致性
async function testDataConsistency() {
    log('\n测试7: 数据一致性测试');
    testResults.total++;

    try {
        // 重置所有筛选
        const resetBtn = document.querySelector('button[onclick="resetFilters()"]');
        if (resetBtn) {
            resetBtn.click();
            await sleep(500);
        }

        // 记录初始状态
        const initialState = getCurrentState();
        log(`初始状态 - 航班数: ${initialState.flightCount}`);

        // 应用筛选
        const departureInput = document.getElementById('departureSearch');
        departureInput.value = '北京';
        departureInput.dispatchEvent(new Event('input'));
        await sleep(500);

        const filteredState = getCurrentState();
        log(`筛选后 - 航班数: ${filteredState.flightCount}`);

        // 清空搜索
        departureInput.value = '';
        departureInput.dispatchEvent(new Event('input'));
        await sleep(500);

        const restoredState = getCurrentState();
        log(`恢复后 - 航班数: ${restoredState.flightCount}`);

        const restoredCorrectly = restoredState.flightCount === initialState.flightCount;
        const filteredCorrectly = filteredState.flightCount < initialState.flightCount;

        if (restoredCorrectly && filteredCorrectly) {
            log('✅ 数据一致性测试通过');
            testResults.passed++;
            return true;
        } else {
            log('❌ 数据一致性测试失败');
            log(`  - 正确恢复: ${restoredCorrectly}`);
            log(`  - 正确筛选: ${filteredCorrectly}`);
            testResults.failed++;
            return false;
        }
    } catch (error) {
        log(`数据一致性测试错误: ${error.message}`, 'error');
        testResults.failed++;
        return false;
    }
}

// 测试8: 性能测试
async function testPerformance() {
    log('\n测试8: 性能测试');
    testResults.total++;

    try {
        // 重置所有筛选
        const resetBtn = document.querySelector('button[onclick="resetFilters()"]');
        if (resetBtn) {
            resetBtn.click();
            await sleep(500);
        }

        // 测试城市搜索性能
        const departureInput = document.getElementById('departureSearch');
        const startTime = performance.now();

        departureInput.value = '北京';
        departureInput.dispatchEvent(new Event('input'));
        await sleep(300);

        const endTime = performance.now();
        const searchTime = endTime - startTime;

        log(`城市搜索耗时: ${searchTime.toFixed(2)}ms`);

        // 测试行程类型切换性能
        const roundTripBtn = document.querySelector('[data-type="round-trip"]');
        const startTime2 = performance.now();

        roundTripBtn.click();
        await sleep(300);

        const endTime2 = performance.now();
        const switchTime = endTime2 - startTime2;

        log(`行程类型切换耗时: ${switchTime.toFixed(2)}ms`);

        // 性能标准
        const searchOk = searchTime < 500;  // 500ms以内
        const switchOk = switchTime < 300;  // 300ms以内

        if (searchOk && switchOk) {
            log('✅ 性能测试通过');
            testResults.passed++;
            return true;
        } else {
            log('❌ 性能测试失败');
            log(`  - 搜索时间合格: ${searchOk} (${searchTime.toFixed(2)}ms)`);
            log(`  - 切换时间合格: ${switchOk} (${switchTime.toFixed(2)}ms)`);
            testResults.failed++;
            return false;
        }
    } catch (error) {
        log(`性能测试错误: ${error.message}`, 'error');
        testResults.failed++;
        return false;
    }
}

// 运行所有测试
async function runComprehensiveTests() {
    log('%c=== 开始运行综合搜索功能测试 ===', 'font-size: 20px; color: blue; font-weight: bold;');

    const tests = [
        { name: '基础页面加载', func: testBasicLoading },
        { name: '城市搜索功能', func: testCitySearch },
        { name: '行程类型切换', func: testTripTypeSwitching },
        { name: '时间段筛选', func: testTimeFiltering },
        { name: '多条件组合筛选', func: testMultipleFilters },
        { name: '边界情况', func: testEdgeCases },
        { name: '数据一致性', func: testDataConsistency },
        { name: '性能测试', func: testPerformance }
    ];

    for (const test of tests) {
        log(`\n--- 正在执行: ${test.name} ---`);
        await test.func();
        await sleep(500); // 测试间隔
    }

    // 输出测试总结
    console.log('\n%c=== 测试总结 ===', 'font-size: 18px; color: blue; font-weight: bold;');
    console.log(`总测试数: ${testResults.total}`);
    console.log(`%c通过: ${testResults.passed}`, 'color: green');
    console.log(`%c失败: ${testResults.failed}`, 'color: red');

    if (testResults.errors.length > 0) {
        console.log('%c错误详情:', 'color: red');
        testResults.errors.forEach(err => {
            console.log(`  - ${err.test}: ${err.error}`);
        });
    }

    const passRate = (testResults.passed / testResults.total * 100).toFixed(1);
    console.log(`\n通过率: ${passRate}%`);

    if (testResults.failed === 0) {
        console.log('%c🎉 所有测试通过！搜索功能运行正常', 'font-size: 24px; color: green; font-weight: bold;');
    } else {
        console.log('%c⚠️ 发现一些问题，请查看详细测试结果', 'font-size: 20px; color: orange; font-weight: bold;');
    }

    return testResults;
}

// 运行特定测试
async function runSpecificTest(testName) {
    const testMap = {
        'basic': testBasicLoading,
        'city': testCitySearch,
        'trip': testTripTypeSwitching,
        'time': testTimeFiltering,
        'multiple': testMultipleFilters,
        'edge': testEdgeCases,
        'consistency': testDataConsistency,
        'performance': testPerformance
    };

    if (testMap[testName]) {
        console.log(`\n=== 运行特定测试: ${testName} ===`);
        await testMap[testName]();
    } else {
        console.error(`未知测试: ${testName}`);
        console.log('可用测试:', Object.keys(testMap).join(', '));
    }
}

// 导出到全局
window.ComprehensiveSearchTests = {
    runAll: runComprehensiveTests,
    run: runSpecificTest,
    results: testResults
};

// 自动运行测试（可选）
// setTimeout(runComprehensiveTests, 1000);

console.log('\n%c综合搜索测试工具已加载！', 'font-size: 16px; color: blue; font-weight: bold;');
console.log('%c使用方法:', 'font-size: 14px; color: green;');
console.log('1. 运行所有测试: ComprehensiveSearchTests.runAll()');
console.log('2. 运行特定测试: ComprehensiveSearchTests.run("city")');
console.log('3. 查看结果: ComprehensiveSearchTests.results');