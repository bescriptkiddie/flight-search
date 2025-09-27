/**
 * 航班搜索逻辑测试运行器
 * 在浏览器控制台中运行这些测试
 */

// 测试配置
const TestConfig = {
    delay: 500, // 操作延迟（毫秒）
    timeout: 5000, // 测试超时时间
    verbose: true // 详细输出
};

// 测试结果统计
const TestResults = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
};

/**
 * 测试辅助函数
 */
function log(message, type = 'info') {
    if (!TestConfig.verbose) return;

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

/**
 * 运行单个测试
 */
async function runTest(testName, testFunction) {
    TestResults.total++;
    log(`开始测试: ${testName}`);

    try {
        const result = await testFunction();
        if (result) {
            TestResults.passed++;
            log(`${testName}: 通过`, 'success');
        } else {
            TestResults.failed++;
            log(`${testName}: 失败`, 'error');
        }
        return result;
    } catch (error) {
        TestResults.failed++;
        TestResults.errors.push({ test: testName, error: error.message });
        log(`${testName}: 错误 - ${error.message}`, 'error');
        return false;
    }
}

/**
 * 等待元素出现
 */
function waitForElement(selector, timeout = TestConfig.timeout) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`元素 ${selector} 未找到`));
        }, timeout);
    });
}

/**
 * 等待指定时间
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 获取当前筛选状态
 */
function getFilterStatus() {
    const departureSearch = document.getElementById('departureSearch')?.value || '';
    const destinationSearch = document.getElementById('destinationSearch')?.value || '';
    const departureSelect = document.getElementById('departure')?.value || '';
    const destinationSelect = document.getElementById('destination')?.value || '';
    const activeTripType = document.querySelector('.trip-type-btn.active')?.textContent || '未知';
    const flightCount = document.querySelectorAll('#flightTableBody tr').length;

    return {
        departureSearch,
        destinationSearch,
        departureSelect,
        destinationSelect,
        activeTripType,
        flightCount
    };
}

/**
 * 测试1: 基础页面加载
 */
async function testPageLoad() {
    log('测试页面加载...');

    // 检查关键元素是否存在
    const elements = [
        'departureSearch',
        'destinationSearch',
        'flightTable',
        'flightTableBody'
    ];

    for (const id of elements) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`关键元素 ${id} 未找到`);
        }
    }

    // 检查是否有航班数据
    const flightRows = document.querySelectorAll('#flightTableBody tr');
    if (flightRows.length === 0) {
        throw new Error('没有找到航班数据');
    }

    log(`找到 ${flightRows.length} 个航班`);
    return true;
}

/**
 * 测试2: 城市搜索功能
 */
async function testCitySearch() {
    log('测试城市搜索功能...');

    const departureInput = document.getElementById('departureSearch');
    const destinationInput = document.getElementById('destinationSearch');

    if (!departureInput || !destinationInput) {
        throw new Error('城市搜索输入框未找到');
    }

    // 清空输入
    departureInput.value = '';
    destinationInput.value = '';
    departureInput.dispatchEvent(new Event('input'));

    await sleep(TestConfig.delay);

    // 输入城市名称
    departureInput.value = '北京';
    departureInput.dispatchEvent(new Event('input'));

    await sleep(TestConfig.delay * 2);

    // 检查搜索结果
    const status = getFilterStatus();
    log(`搜索后状态: ${JSON.stringify(status)}`);

    // 验证是否只显示包含"北京"的航班
    const flightRows = document.querySelectorAll('#flightTableBody tr');
    let hasBeijingFlight = false;

    flightRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes('北京')) {
            hasBeijingFlight = true;
        }
    });

    return hasBeijingFlight && flightRows.length > 0;
}

/**
 * 测试3: 行程类型切换
 */
async function testTripTypeSwitching() {
    log('测试行程类型切换...');

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

    await sleep(TestConfig.delay * 2);

    // 切换到往返
    roundTripBtn.click();
    await sleep(TestConfig.delay * 2);

    const roundTripStatus = getFilterStatus();
    log(`往返模式状态: ${JSON.stringify(roundTripStatus)}`);

    // 切换到单程
    oneWayBtn.click();
    await sleep(TestConfig.delay * 2);

    const oneWayStatus = getFilterStatus();
    log(`单程模式状态: ${JSON.stringify(oneWayStatus)}`);

    // 验证城市条件是否保留
    const hasCityCondition = departureInput.value === '北京' && destinationInput.value === '上海';

    return hasCityCondition && roundTripStatus.flightCount > 0 && oneWayStatus.flightCount > 0;
}

/**
 * 测试4: 时间段筛选
 */
async function testTimeFiltering() {
    log('测试时间段筛选...');

    // 清除所有筛选
    const resetBtn = document.querySelector('button[onclick="resetFilters()"]');
    if (resetBtn) {
        resetBtn.click();
        await sleep(TestConfig.delay);
    }

    // 选择晚上时间段
    const nightBtn = document.querySelector('[data-time="night"]');
    if (!nightBtn) {
        throw new Error('晚上时间段按钮未找到');
    }

    nightBtn.click();
    await sleep(TestConfig.delay * 2);

    const status = getFilterStatus();
    log(`晚上筛选状态: ${JSON.stringify(status)}`);

    // 验证只显示晚上航班
    const flightRows = document.querySelectorAll('#flightTableBody tr');
    let allNightFlights = true;

    flightRows.forEach(row => {
        const timeText = row.textContent;
        // 简单的晚上时间判断
        if (!timeText.match(/(18|19|20|21|22|23):\d{2}/) && !timeText.match(/00:\d{2}/)) {
            allNightFlights = false;
        }
    });

    return allNightFlights && flightRows.length > 0;
}

/**
 * 测试5: 2666可用筛选
 */
async function test2666Filter() {
    log('测试2666可用筛选...');

    const filterBtn = document.querySelector('[data-availability="2666"]');
    if (!filterBtn) {
        throw new Error('2666可用按钮未找到');
    }

    // 点击筛选
    filterBtn.click();
    await sleep(TestConfig.delay * 2);

    const status1 = getFilterStatus();
    log(`2666筛选后: ${JSON.stringify(status1)}`);

    // 取消筛选
    filterBtn.click();
    await sleep(TestConfig.delay * 2);

    const status2 = getFilterStatus();
    log(`取消2666后: ${JSON.stringify(status2)}`);

    return status1.flightCount !== status2.flightCount;
}

/**
 * 测试6: 多条件组合筛选
 */
async function testMultipleFilters() {
    log('测试多条件组合筛选...');

    // 重置筛选
    const resetBtn = document.querySelector('button[onclick="resetFilters()"]');
    if (resetBtn) {
        resetBtn.click();
        await sleep(TestConfig.delay);
    }

    // 设置城市搜索
    const departureInput = document.getElementById('departureSearch');
    const destinationInput = document.getElementById('destinationSearch');

    departureInput.value = '北京';
    destinationInput.value = '上海';
    departureInput.dispatchEvent(new Event('input'));

    await sleep(TestConfig.delay * 2);

    // 应用时间段筛选
    const nightBtn = document.querySelector('[data-time="night"]');
    if (nightBtn) {
        nightBtn.click();
        await sleep(TestConfig.delay);
    }

    // 应用2666筛选
    const filter2666 = document.querySelector('[data-availability="2666"]');
    if (filter2666) {
        filter2666.click();
        await sleep(TestConfig.delay);
    }

    const status = getFilterStatus();
    log(`多条件筛选状态: ${JSON.stringify(status)}`);

    return status.flightCount > 0 && status.departureSearch === '北京' && status.destinationSearch === '上海';
}

/**
 * 测试7: 边界情况测试
 */
async function testEdgeCases() {
    log('测试边界情况...');

    // 测试1: 空搜索
    const departureInput = document.getElementById('departureSearch');
    const destinationInput = document.getElementById('destinationSearch');

    departureInput.value = '';
    destinationInput.value = '';
    departureInput.dispatchEvent(new Event('input'));

    await sleep(TestConfig.delay);

    const emptyStatus = getFilterStatus();
    log(`空搜索状态: ${JSON.stringify(emptyStatus)}`);

    // 测试2: 搜索不存在的城市
    departureInput.value = '不存在的城市';
    destinationInput.value = '另一个不存在的城市';
    departureInput.dispatchEvent(new Event('input'));

    await sleep(TestConfig.delay * 2);

    const noResultStatus = getFilterStatus();
    log(`无结果状态: ${JSON.stringify(noResultStatus)}`);

    // 检查是否显示无结果提示
    const noResultsText = document.querySelector('#flightTableBody')?.textContent || '';
    const hasNoResultsMessage = noResultsText.includes('没有找到') || noResultsText.includes('未找到');

    return emptyStatus.flightCount > 0 && noResultStatus.flightCount === 0 && hasNoResultsMessage;
}

/**
 * 测试8: 数据一致性测试
 */
async function testDataConsistency() {
    log('测试数据一致性...');

    // 重置所有筛选
    const resetBtn = document.querySelector('button[onclick="resetFilters()"]');
    if (resetBtn) {
        resetBtn.click();
        await sleep(TestConfig.delay);
    }

    // 记录初始状态
    const initialCount = getFilterStatus().flightCount;

    // 应用筛选
    const departureInput = document.getElementById('departureSearch');
    departureInput.value = '北京';
    departureInput.dispatchEvent(new Event('input'));

    await sleep(TestConfig.delay * 2);

    const filteredCount = getFilterStatus().flightCount;

    // 清空搜索
    departureInput.value = '';
    departureInput.dispatchEvent(new Event('input'));

    await sleep(TestConfig.delay * 2);

    const restoredCount = getFilterStatus().flightCount;

    log(`数据一致性: 初始=${initialCount}, 筛选后=${filteredCount}, 恢复后=${restoredCount}`);

    return restoredCount === initialCount && filteredCount < initialCount;
}

/**
 * 运行所有测试
 */
async function runAllTests() {
    console.clear();
    console.log('%c=== 航班搜索逻辑测试开始 ===', 'font-size: 20px; color: blue; font-weight: bold;');

    // 确保页面完全加载
    await sleep(1000);

    // 定义测试套件
    const tests = [
        { name: '页面加载测试', func: testPageLoad },
        { name: '城市搜索功能', func: testCitySearch },
        { name: '行程类型切换', func: testTripTypeSwitching },
        { name: '时间段筛选', func: testTimeFiltering },
        { name: '2666可用筛选', func: test2666Filter },
        { name: '多条件组合筛选', func: testMultipleFilters },
        { name: '边界情况测试', func: testEdgeCases },
        { name: '数据一致性测试', func: testDataConsistency }
    ];

    // 运行所有测试
    for (const test of tests) {
        await runTest(test.name, test.func);
        await sleep(TestConfig.delay);
    }

    // 输出测试总结
    console.log('\n%c=== 测试总结 ===', 'font-size: 18px; color: blue; font-weight: bold;');
    console.log(`总测试数: ${TestResults.total}`);
    console.log(`%c通过: ${TestResults.passed}`, 'color: green');
    console.log(`%c失败: ${TestResults.failed}`, 'color: red');

    if (TestResults.errors.length > 0) {
        console.log('%c错误详情:', 'color: red');
        TestResults.errors.forEach(err => {
            console.log(`  - ${err.test}: ${err.error}`);
        });
    }

    const passRate = (TestResults.passed / TestResults.total * 100).toFixed(1);
    console.log(`\n通过率: ${passRate}%`);

    if (TestResults.failed === 0) {
        console.log('%c🎉 所有测试通过！', 'font-size: 24px; color: green; font-weight: bold;');
    } else {
        console.log('%c⚠️ 部分测试失败，请检查问题', 'font-size: 20px; color: orange; font-weight: bold;');
    }

    return TestResults;
}

/**
 * 运行特定测试
 */
async function runSpecificTest(testName) {
    const testMap = {
        'pageLoad': testPageLoad,
        'citySearch': testCitySearch,
        'tripType': testTripTypeSwitching,
        'timeFilter': testTimeFiltering,
        'filter2666': test2666Filter,
        'multipleFilters': testMultipleFilters,
        'edgeCases': testEdgeCases,
        'consistency': testDataConsistency
    };

    if (testMap[testName]) {
        console.log(`\n=== 运行特定测试: ${testName} ===`);
        await runTest(testName, testMap[testName]);
    } else {
        console.error(`未知测试: ${testName}`);
        console.log('可用测试:', Object.keys(testMap).join(', '));
    }
}

// 导出到全局
window.FlightSearchTests = {
    runAll: runAllTests,
    run: runSpecificTest,
    config: TestConfig,
    results: TestResults
};

// 添加控制台快捷命令
console.log('\n%c航班搜索测试工具已加载！', 'font-size: 16px; color: blue; font-weight: bold;');
console.log('%c使用方法:', 'font-size: 14px; color: green;');
console.log('1. 运行所有测试: FlightSearchTests.runAll()');
console.log('2. 运行特定测试: FlightSearchTests.run("citySearch")');
console.log('3. 查看测试结果: FlightSearchTests.results');
console.log('4. 修改配置: FlightSearchTests.config.delay = 1000');

// 自动运行测试（可选）
// setTimeout(runAllTests, 2000); // 2秒后自动运行